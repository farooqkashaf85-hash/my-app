const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post(
  "/uploads",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      res.status(201).json({
        message: "File uploaded successfully",
        fileUrl: req.file.path,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  );
module.exports = router;
