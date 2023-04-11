const mongoose = require("mongoose");

// User schema
const Reply = mongoose.model(
  "Reply",
  new mongoose.Schema({
    mainPostId: mongoose.Schema.Types.ObjectId,
    currentNestId: mongoose.Schema.Types.ObjectId,
    username: String,
    post: String,
    date: String,
    profileImage: String,
    profileColor: String,
    replyPosts: Array,
  })
);

// exports
module.exports = Reply;
