const express = require("express"),
    router = express.Router();
const pool = require("../pool");
const Errors = require("../error");
const indexMiddleware = require("../middleware/index"),
    f = indexMiddleware.asyncWrapper;
const {userExists} = require("../middleware/user");

router.use(indexMiddleware.isLoggedIn);

////////// GET USER //////////
router.get("/:id", userExists, f(async (req, res, next) => {
    let sql = `SELECT * FROM user WHERE id=?`
    let [user] = await pool.query(sql, [req.params.id]);
    res.json(user[0]);
}));

////////// REQUEST USER //////////
router.post("/:id/request", userExists, f(async (req, res) => {
    let sql = `INSERT INTO user_request (user_id, requested_user_id) VALUES(?, ?)`
    await pool.query(sql, [req.user[0].id, req.params.id]);
    res.send("Request successfully sent.")
}));

////////// UPDATE USER //////////
router.put("/:id", indexMiddleware.isAuthorized, userExists, f(async (req, res) => {
    let sql = `
    UPDATE user
    SET
    user_name=?,
    gender=?,
    interestedGenders=?,
    location=POINT(?, ?),
    distance=?,
    about=?,
    okActions=?,
    notOkActions=?
    WHERE id=?
    `
    let queryValues = [
        req.body.name, 
        req.body.gender, 
        req.body.interestedGenders, 
        req.body.location[0], req.body.location[1],
        req.body.distance,
        req.body.about,
        req.body.okActions,
        req.body.notOkActions,
        req.params.id,
        req.params.id
    ]
    await pool.query(sql, queryValues);
    res.redirect(`/users/${req.params.id}`);
}));

////////// DELETE USER //////////
router.delete("/:id/delete", indexMiddleware.isAuthorized, userExists, f(async (req, res) => {
    let sql = `DELETE FROM user WHERE id=?;`
    await pool.query(sql, [req.params.id]);
    res.send("Account successfully deleted.")
}));

module.exports = router;