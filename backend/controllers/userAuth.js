const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const fetchuser = require("../middleware/fetchUser");
const authorizeRoles = require("../middleware/authorizeRole");
const { sendVerificationCodeEmail, sendWelcomeEmail } = require("../utils/emailService");

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const buildToken = (user) => {
  const data = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  return jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

router.post("/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const email = req.body.email.toLowerCase();
      let user = await User.findOne({ email });

      if (user && user.isVerified) {
        return res.status(400).json({ success: false, error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      const verificationCode = generateVerificationCode();

      if (user && !user.isVerified) {
        user.password = secPass;
        user.verificationCode = verificationCode;
        user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        user.name = req.body.name;
        await user.save();
      } else {
        user = await User.create({
          name: req.body.name,
          email,
          password: secPass,
          role: req.body.role === "admin" ? "admin" : "user",
          isVerified: false,
          verificationCode,
          verificationCodeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
      }

      try {
        await sendVerificationCodeEmail({
          name: user.name,
          email: user.email,
          code: verificationCode,
        });
      } catch (emailError) {
        console.error("Verification email failed:", emailError.message);
      }

      return res.json({
        success: true,
        requiresVerification: true,
        email: user.email,
        message: "Verification code sent to your email. Please verify to activate your account.",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  },
);

router.post("/verify-email",
  [
    body("email", "Enter valid email").isEmail(),
    body("code", "Verification code is required").isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const email = req.body.email.toLowerCase();
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      if (user.isVerified) {
        const token = buildToken(user);
        return res.json({ success: true, message: "Account already verified", jwttoken: token });
      }

      if (!user.verificationCode || !user.verificationCodeExpiresAt) {
        return res.status(400).json({ success: false, error: "No verification code found. Please sign up again." });
      }

      const isExpired = new Date(user.verificationCodeExpiresAt).getTime() < Date.now();
      if (isExpired) {
        return res.status(400).json({ success: false, error: "Verification code has expired. Please sign up again." });
      }

      if (user.verificationCode !== req.body.code) {
        return res.status(400).json({ success: false, error: "Invalid verification code" });
      }

      user.isVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpiresAt = null;
      await user.save();

      try {
        await sendWelcomeEmail({
          name: user.name,
          email: user.email,
        });
      } catch (emailError) {
        console.error("Welcome email failed:", emailError.message);
      }

      const jwttoken = buildToken(user);
      return res.json({ success: true, jwttoken, message: "Email verified successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  },
);

router.post("/resend-code",
  [
    body("email", "Enter valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const email = req.body.email.toLowerCase();
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({ success: false, error: "This account is already verified" });
      }

      const verificationCode = generateVerificationCode();
      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      try {
        await sendVerificationCodeEmail({
          name: user.name,
          email: user.email,
          code: verificationCode,
        });
      } catch (emailError) {
        console.error("Verification email resend failed:", emailError.message);
      }

      return res.json({
        success: true,
        message: "Verification code sent again to your email.",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  },
);

router.post("/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").exists(),
  ],
  async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ success: false, error: "Invalid Login : Please try to login with correct credentials" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(400).json({ success: false, error: "Invalid Login : Please try to login with correct credentials" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ success: false, error: "Please verify your email before logging in." });
      }

      const jwttoken = buildToken(user);
      return res.json({ success: true, jwttoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  },
);

//get loggedin details using post /getuser. login required
router.post('/getuser' , fetchuser, async (req,res) =>{
    try {
        const  userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
         console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
})
//admin only route to get all users

router.get('/allusers', fetchuser, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//admin only route
router.get('/admin-only', fetchuser, authorizeRoles('admin'), async (req, res) => {
  try {
    res.json({ success: true, message: "Welcome admin" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
