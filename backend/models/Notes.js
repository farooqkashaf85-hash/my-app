const mongoose = require("mongoose");

const noteschema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
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

//indexes
noteschema.index({user: 1});
noteschema.index({Title: 1});

//search optimization
noteschema.index({
  Title: "text",
  Content: "text",
})
module.exports = mongoose.model("Mynotes", noteschema);
