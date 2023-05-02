const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true
  },
  postPW: {
    type: Number,
    required: true,
    unique: false
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true,
    unique: false
  },
  writer: {
    type: String,
    required: true,
    unique: false
  },
  date: {
    type: String,
    required: true,
    unique: false
  }
});

module.exports = mongoose.model("post", postSchema);