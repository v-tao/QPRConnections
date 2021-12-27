const express = require("express"),
    mysql = require("mysql");
    
const app = express();
require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "QPRConnections"
});

connection.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to DB');
});

app.get("/", (req, res, next) => {
    res.send("test");
});

app.listen(3000, function () {
    console.log("Server Started");
  });