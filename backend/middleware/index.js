const pool = require("../pool");
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.send("You must be logged in to do this.");
    }
}

const isAuthorized = (req, res, next) => {
    if (req.user[0].id !=  req.params.id) {
        res.send("You do not have permission to do that.");
    } else {
        next();
    }
}

module.exports = {isLoggedIn, isAuthorized};