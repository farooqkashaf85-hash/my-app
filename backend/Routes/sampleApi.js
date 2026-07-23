const express = require("express");
const router = express.Router();

//sample api
router.get ("/" , (req , res) => {
    console.log("Sample APi started");
    res.status(200).json({
        success : true,
        message : "Sample Api is running"
    });
});

module.exports = router;