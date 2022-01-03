const pool = require("../pool");

// determines if the current user sent the request
const sentRequest = (req, res, next) => {
    let sql = `SELECT user_id FROM user_request WHERE id=?`;
    pool.query(sql, [req.params.id], (err, sentUser) => {
        if (err) throw err;
        if (sentUser[0].user_id != req.user[0].id) {
            res.send("You do not have permission to do that.");
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
            res.send("You do not have permission to do that.");
        } else {
            next();
        }
    });
}

module.exports = {sentRequest, receivedRequest};