const express = require("express");
const router = express.Router();

//health route
router.get("/" , (req , res) => {
    console.log("Health is good");
    res.status(200).json({
        success : true,
        message : "Health Api is running"
    });
});

module.exports = router;