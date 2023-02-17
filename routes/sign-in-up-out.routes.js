const bcrypt = require("bcrypt");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  const db = require("../models");
  const User = db.user;

  app.post("/api/auth/signup", (req, res) => {
    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err) => {
      res.send({ message: "User was registered successfully!" });
    });
  });

  app.post("/api/auth/signin");

  app.post("/api/auth/signout");
};
