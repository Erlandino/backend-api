// Imports
const mongoose = require("mongoose");

// User schema
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

// exports
module.exports = User;
