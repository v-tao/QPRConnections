const Errors = require("../error");

const asyncWrapper = (cb) => {
    return (req, res, next) => cb(req, res, next).catch(next);
}

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

module.exports = {
    asyncWrapper: asyncWrapper,
    isLoggedIn: isLoggedIn, 
    isAuthorized: isAuthorized,
}