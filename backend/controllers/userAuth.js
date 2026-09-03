const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const fetchuser = require("../middleware/fetchUser");
const authorizeRoles = require("../middleware/authorizeRole");

// ROTER 1 :crating a new user using post  /contollers/userAuth/createuser  no login require (sign-in)
router.post( "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if error occurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        role: req.body.role === "admin" ? "admin" : "user",
      });
      const data = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      const jwttoken = jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
      return res.json({success: true,jwttoken : jwttoken});
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  },
);
// ROUTER 2 : crating a new user using post  /contollers/userAuth/createuser  (log-in)
router.post( "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").exists(),
  ],
  async (req, res) => { 
    //if error occurs return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email , password} = req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
           success = false;
           return res.status(400).json({success: false, error : "Invalid Login : Please try to login with correct credentials"})
        }

        const comparePassword =await bcrypt.compare(password , user.password)
        if(!comparePassword){
            return res.status(400).json({ success: false , error : "Invalid Login : Please try to login with correct credentials"})
        }
        
      const data = {
        user: {
          id: user.id,
          role: user.role,
        },
      };
      const jwttoken = jwt.sign(data, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
      return res.json({success: true, jwttoken : jwttoken});
    } 
    catch (error) {
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
