// Imports
const db = require("../models");
const User = db.user;

// checks if the username received from api is the same as one in the database
function verifySignUp(req, res, next) {
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (user) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // Username is already in the database
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    if (
      !req.body.username ||
      req.body.password.length < 6 ||
      req.body.password !== req.body.confirmPassword
    ) {
      const signupErrors = {
        username: false,
        passwordLength: false,
        confirmPassword: false,
      };

      // If no username is entered
      if (!req.body.username) {
        signupErrors.username = "No username entered";
      }
      // Password is less than 6 characters long
      if (req.body.password.length < 6) {
        signupErrors.passwordLength = "Password needs to be at least 6 characters long";
      }
      // First and second password inputs aren't equal
      if (req.body.password !== req.body.confirmPassword) {
        signupErrors.confirmPassword = "Passwords in both inputs need to be equal";
      }

      res.status(400).send(signupErrors);
      return;
    }

    next();
  });
}

module.exports = verifySignUp;
