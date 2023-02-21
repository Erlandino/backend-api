// Imports
const express = require("express");
const app = express();
const userModels = require("./models");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieSession = require("cookie-session");

mongoose.set("strictQuery", false);

// Parse requests of content-type - application/json
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    secret: process.env.COOKIE_SECRET, // should use as secret environment variable
    httpOnly: true,
  })
);

// Simple routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html"); /* Home */
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/html/login.html"); /* Login */
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/html/sign-up.html"); /* Sign up */
});

// Routes
require("./routes/account.routes")(app); /* api */

// Server starter -
app.listen(9000, () => {
  console.log("server is running");
});

// mongoose connecting server to mongo database
userModels.mongoose
  /* Data base connection url */
  .connect(`${process.env.mongoUrl}`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
