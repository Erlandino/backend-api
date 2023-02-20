// imports
const bcrypt = require("bcrypt"); /* Encrypts passwords */
const verifySignUp = require("../middleware/verifySignUp");
const db = require("../models");

const User = db.user;

// exports api routes to server.js
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  // Sign up api
  app.post("/api/auth/signup", [verifySignUp], (req, res) => {
    // below runs if verifySignUp returns false
    // creates new object with username and password
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    // sends the object to database
    user.save((err) => {
      res.send({ message: "User was registered successfully!" });
    });
  });

  // Sign in api
  app.post("/api/auth/signin", (req, res) => {
    User.findOne({ username: req.body.username }).exec((err, user) => {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.status(200).send({ message: "Correct! User logged in!" });
      } else {
        res.status(400).send({ message: "Failed! Wrong password!" });
        return;
      }
    });
  });

  // Sign out api
  app.post("/api/auth/signout");
};
