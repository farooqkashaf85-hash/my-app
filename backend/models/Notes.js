const mongoose = require("mongoose");

const noteschema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Content: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Mynotes", noteschema);
