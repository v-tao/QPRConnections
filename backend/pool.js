const mysql = require("mysql");
require("dotenv").config();
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "QPRConnections"
});

module.exports = pool;