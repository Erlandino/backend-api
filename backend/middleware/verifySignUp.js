// Imports
const db = require("../models");
const User = db.user;

// checks if the username received from api is the same as one in the database
function checkDuplicateUsername(req, res, next) {
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (user) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // username is already in the database
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
    next();
  });
}

module.exports = checkDuplicateUsername;
