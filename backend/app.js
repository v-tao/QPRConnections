const express = require("express");
const indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user");
const app = express();
const pool = require("./pool.js")
app.use(express.json());

////////// ROUTES //////////
app.use("/", indexRoutes);
app.use("/users", userRoutes);

require("dotenv").config();

app.listen(3000, function () {
    console.log("Server Started");
  });