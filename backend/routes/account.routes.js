// imports
const bcrypt = require("bcryptjs"); /* Encrypts passwords */
const verifySignUp = require("../middleware/verifySignUp");
const verifyToken = require("../middleware/verifyToken");
const db = require("../models");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
const mongoose = require("mongoose");
const { findOneAndUpdate } = require("../models/user.model");

const User = db.user;
const Post = db.post;
const Reply = db.reply;

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
      res.status(201).send({ message: "User was registered successfully!" });
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
        res.status(200).send({ message: "Logged in successfully" });
      } else {
        res.status(401).send({ message: "Failed! Wrong username!" });
      }
    });
  });

  // Sign out api
  app.post("/api/auth/signout", (req, res, next) => {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  });

  // VerifyToken route
  app.get("/verifyToken", [verifyToken], (req, res, next) => {
    res.status(200).send({ message: "Account verified!", token: true });
  });

  // Get Profile route
  app.get("/api/auth/profile", [verifyToken], (req, res, next) => {
    User.findOne({ _id: req.userId }, function (err, user) {
      if (user) {
        res.status(200).send({
          message: "Account verified!",
          token: true,
          userName: user.username,
          profileImage: user.profileImage,
          profileColor: user.profileColor,
        });
      } else {
        res.status(401).send({ message: "Bad token", token: false });
      }
    });
  });

  // Post Profile route
  app.post("/api/auth/profile", [verifyToken], async (req, res, next) => {
    User.findOne({ _id: req.userId }, async function (err, user) {
      if (user) {
        console.log(req.body);
        const updatePosts = await Post.updateMany(
          { username: user.username },
          { profileImage: req.body.profileImage, profileColor: req.body.profileColor },
          { upsert: true }
        );

        const updateProfile = await User.findOneAndUpdate(
          { _id: req.userId },
          { profileImage: req.body.profileImage, profileColor: req.body.profileColor },
          { upsert: true, new: true }
        );

        res.status(200).send({ message: "Account was updated!" });
      } else {
        res.status(401).send({ message: "Bad token" });
      }
    });
  });

  // User posts a comment api
  app.post("/api/auth/comment", [verifyToken], (req, res, next) => {
    User.findOne({ _id: req.userId }, async (err, user) => {
      if (user) {
        const post = new Post({
          username: user.username,
          post: req.body.post,
          date: req.body.date,
          profileImage: user.profileImage,
          profileColor: user.profileColor,
        });
        post.save((err) => {
          res.status(201).send({ message: "post was registered successfully!" });
        });
      } else {
        res.status(400).send({ message: "User currently not logged in" });
      }
    });
  });

  // User replies to a comment api
  app.post("/api/auth/reply", [verifyToken], (req, res, next) => {
    User.findOne({ _id: req.userId }, async (err, user) => {
      if (user) {
        console.log(req.body.replyId);
        console.log(req.body.topId);

        const newReplyPost = new Reply({
          mainPostId: req.body.topId
            ? mongoose.Types.ObjectId(req.body.topId)
            : mongoose.Types.ObjectId(req.body.replyId),
          currentNestId: req.body.topId ? mongoose.Types.ObjectId(req.body.replyId) : null,
          username: user.username,
          post: req.body.post,
          date: req.body.date,
          profileImage: user.profileImage,
          profileColor: user.profileColor,
        });

        if (req.body.topId) {
          Reply.findOneAndUpdate(
            { _id: req.body.replyId },
            { $push: { replyPosts: newReplyPost._id } },
            function (error, success) {
              if (error) {
                console.log(error);
              } else {
                console.log(success);
              }
            }
          );
        } else if (req.body.replyId) {
          Post.findOneAndUpdate(
            { _id: req.body.replyId },
            { $push: { replyPosts: newReplyPost._id } },
            function (error, success) {
              if (error) {
                console.log(error);
              } else {
                console.log(success);
              }
            }
          );
        }

        newReplyPost.save((err) => {
          res.status(201).send({ message: "reply was registered successfully!" });
        });
      } else {
        res.status(401).send({ message: "User currently not logged in" });
      }
    });
  });

  // retrieves a set amount of comments from database api
  app.get("/api/auth/user-comments", async (req, res, next) => {
    const { limit, offset } = req.query;
    if (isNaN(offset)) {
      res.status(400).send({ message: "Offset need to be numbers" });
    } else {
      const count = await Post.countDocuments();

      Post.find({}, async function (err, mainPosts) {
        const replies = await Promise.all(
          mainPosts.map((element) => {
            const reply = Reply.find({ mainPostId: element._id });
            return reply;
          })
        );
        res.send({ posts: mainPosts, replies: replies, totalPosts: count });
      })
        .skip(offset)
        .sort({ _id: -1 })
        .limit(limit);
    }
  });
};
