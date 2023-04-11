const mongoose = require("mongoose");
const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.post = require("./post.model");
db.reply = require("./reply.model");

module.exports = db;
