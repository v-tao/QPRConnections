const mysql = require("mysql2");
require("dotenv").config();
const pool = mysql.createPoolPromise({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "QPRConnections",
    multipleStatements: true,
});

module.exports = pool;