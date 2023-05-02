const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true
  },
  postId: {
    type: Number,
    required: true,
    unique: false
  },
  commentCont: {
    type: String,
    required: true,
    unique: true
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

module.exports = mongoose.model("comment", commentSchema);