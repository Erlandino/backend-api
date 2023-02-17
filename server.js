const express = require("express");
const app = express();
const userModels = require("./models");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// parse requests of content-type - application/json
app.use(express.json());

// simple routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/html/login.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/html/sign-up.html");
});

// routes
require("./routes/sign-in-up-out.routes")(app);

app.listen(9000, () => {
  console.log("server is running");
});

const username = encodeURIComponent("Erlando");
const password = encodeURIComponent("bo9e6cbo9e6c");
const clusterUrl = "@cluster0.sj6o3fg.mongodb.net";

userModels.mongoose
  .connect(`mongodb+srv://${username}:${password}${clusterUrl}/independent-database`)
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
