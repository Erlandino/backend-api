// imports
const bcrypt = require("bcryptjs"); /* Encrypts passwords */
const verifySignUp = require("../middleware/verifySignUp");
const verifyToken = require("../middleware/verifyToken");
const db = require("../models");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");

const User = db.user;
const Post = db.post;

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
  app.post("/api/auth/signin", (req, res, next) => {
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
        res.send("Logged in successfully");
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
  app.get("/verifyToken", [verifyToken], (req, res, next) => {
    res.status(200).send({ message: "Account verified!" });
  });

  // User posts a comment api
  app.post("/api/auth/comment", [verifyToken], (req, res, next) => {
    User.findOne({ _id: req.userId }).exec((err, user) => {
      if (user) {
        const post = new Post({
          username: user.username,
          post: req.body.post,
        });

        post.save((err) => {
          res.send({ message: "post was registered successfully!" });
        });
      } else {
        res.status(400).send({ message: "User currently not logged in" });
      }
    });
  });

  // retrieves all comments from database api
  app.get("/api/auth/user-comments", (req, res, next) => {
    Post.find({}, function (err, posts) {
      res.send(posts);
    });
  });
};
