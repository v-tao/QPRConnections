const Errors = require("../error");

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        throw new Errors.NotLoggedIn();
    }
}

const isAuthorized = (req, res, next) => {
    if (req.user[0].id !=  req.params.id) {
        throw new Errors.Unauthorized();
    } else {
        next();
    }
}

module.exports = {isLoggedIn, isAuthorized};