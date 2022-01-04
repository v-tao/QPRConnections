const pool = require("../pool");
const Errors = require("../error");
const f = require("./index").asyncWrapper;

// determines if the request exists
const requestExists = f(async function (req, res, next) {
    let sql = `SELECT * FROM user WHERE id=?`
    let [request] = await pool.query(sql, [req.params.id]);
    if (request.length == 0) {
        throw new Errors.NotFound("Request");
    } else {
        next();
    }
});

// determines if the current user sent the request
const sentRequest = (req, res, next) => {
    let sql = `SELECT user_id FROM user_request WHERE id=?`;
    pool.query(sql, [req.params.id], (err, sentUser) => {
        if (err) throw err;
        if (sentUser[0].user_id != req.user[0].id) {
            throw new Errors.Unauthorized();
        } else {
            next();
        }
    });
}

// determines if the current user received the request
const receivedRequest = (req, res, next) => {
    let sql = `SELECT requested_user_id FROM user_request WHERE id=?`;
    pool.query(sql, [req.params.id], (err, requestedUser) => {
        if (err) throw err;
        if (requestedUser[0].requested_user_id != req.user[0].id) {
            throw new Errors.Unauthorized();
        } else {
            next();
        }
    });
}

module.exports = {
    requestExists: requestExists,
    sentRequest: sentRequest, 
    receivedRequest: receivedRequest
}