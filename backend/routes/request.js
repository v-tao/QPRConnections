const express = require("express"),
    router = express.Router();

const pool = require("../pool");
const indexMiddleware = require("../middleware/index");
const {sentRequest, receivedRequest} = require("../middleware/request");

router.use(indexMiddleware.isLoggedIn);

////////// GET REQUESTS SENT //////////
router.get("/sent", (req, res) => {
    let sql = `
    SELECT * FROM user LEFT JOIN user_request 
    ON user.id=user_request.requested_user_id 
    WHERE user_request.user_id=?
    `
    pool.query(sql, [req.user[0].id], (err, sentRequests) => {
        if(err) throw err;
        res.json(sentRequests);
    });
});
  
////////// GET REQUESTS RECEIVED //////////
router.get("/received", (req, res) => {
    // return the requests that have not already been rejected
    let sql = `
    SELECT * FROM user LEFT JOIN user_request
    ON user.id=user_request.user_id
    WHERE user_request.requested_user_id=? AND user_request.rejected=FALSE
    `
    pool.query(sql, [req.user[0].id], (err, receivedRequests) => {
        if (err) throw err;
        res.json(receivedRequests);
    });
});

////////// DELETE REQUEST //////////
router.delete("/:id/delete", sentRequest, (req, res) => {
    let sql = `DELETE FROM user_request WHERE id=?`
    pool.query(sql, [req.params.id], (err, request) => {
        if (err) throw err;
        res.send("Request successfully deleted.");
    });
});

////////// ACCEPT REQUEST (match) //////////
router.post("/:id/accept", receivedRequest, (req, res) => {
    // add users to match table and delete request
    let sql =  `
    INSERT INTO user_match (first_user_id, second_user_id)
    SELECT user_id, requested_user_id
    FROM user_request
    WHERE id=?;
    DELETE FROM user_request WHERE id=?
    `
    pool.query(sql, [req.params.id, req.params.id], (err, match) => {
        if (err) throw err;
        res.send("Request successfully accepted.");
    })
});

////////// REJECT REQUEST //////////
router.post("/:id/reject", receivedRequest, (req, res) => {
    // set the rejected field of the request to true
    let sql =  `UPDATE user_request SET rejected=TRUE WHERE id=?`
    pool.query(sql, [req.params.id], (err, request) => {
        if (err) throw err;
        res.send("Request successfully rejected.");
    });
});

module.exports = router;