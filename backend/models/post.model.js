const mongoose = require("mongoose");

// User schema
const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    username: String,
    post: String,
    date: String,
    profileImage: String,
    profileColor: String,
    replyPost: Array,
  })
);

// exports
module.exports = Post;
