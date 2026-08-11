const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/uploads", upload.single("file"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded"
    });
  }

  res.status(201).json({
    message: "File uploaded successfully",
    fileUrl: `/uploads/${req.file.filename}`,
  });

});
module.exports = router;
