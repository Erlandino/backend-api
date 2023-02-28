const mongoose = require("mongoose");
const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.post = require("./post.model");

module.exports = db;
