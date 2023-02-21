// imports
const bcrypt = require("bcryptjs"); /* Encrypts passwords */
const verifySignUp = require("../middleware/verifySignUp");
const db = require("../models");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");

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
      if (user) {
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res.status(400).send({ message: "Failed! Wrong password!" });
          return;
        }
        const token = jwt.sign({ id: user.id }, process.env.jwtKey, {
          expiresIn: 86400, // 24 hours
        });
        req.session.token = token;

        res.status(200).send({ message: "Correct! User logged in!" });
      } else {
        res.status(400).send({ message: "Failed! Wrong username!" });
      }
    });
  });

  // Sign out api
  app.post("/api/auth/signout", (req, res, next) => {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  });

  // Profile route
  app.get(
    "/profile",
    (req, res, next) => {
      let token = req.session.token; /* session token */
      // if no token is present (user not logged in)
      if (!token) {
        res.status(401).send({ message: "Failed! No token provided!" });

        // if token is present
      }
      // checks if token present is valid
      else
        jwt.verify(token, process.env.jwtKey, (err, decoded) => {
          if (err) {
            // if its not valid
            console.log(token);
            return res.status(403).send({ message: "Unauthorized!" });
          }
          req.userId = decoded.id;
          next();
        });
    },
    (req, res, next) => res.sendFile(path.join(__dirname, "..", "html", "profile.html"))
  );
};
