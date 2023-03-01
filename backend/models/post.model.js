const mongoose = require("mongoose");

// User schema
const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    username: String,
    post: String,
  })
);

// exports
module.exports = Post;
