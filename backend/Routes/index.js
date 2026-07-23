const express = require("express")
const router = express.Router();

//simple get route
router.get("/" , (req,res) => {
    console.log("GET API started");
    res.status(200).json({
        success : true,
        message : "Api is working"
    });
});

module.exports = router;