const express = require("express"),
    router = express.Router();
const pool = require("../pool");
const Errors = require("../error");
const {isLoggedIn, isAuthorized} = require("../middleware/index");

router.use(isLoggedIn);

////////// GET USER //////////
router.get("/:id", async (req, res, next) => {
    let sql = `SELECT * FROM user WHERE id=?`
    try {
        let [user] = await pool.query(sql, [req.params.id]);
        if (user.length == 0) {
            throw new Errors.NotFound("User");
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
})

////////// REQUEST USER //////////
router.post("/:id/request", (req, res) => {
    let sql = `INSERT INTO user_request (user_id, requested_user_id) VALUES(?, ?)`
    pool.query(sql, [req.user[0].id, req.params.id], (err, user) => {
        if (err) throw err;
        res.send("Request successfully sent.");
    })
})

////////// UPDATE USER //////////
router.put("/:id", isAuthorized, (req, res) => {
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
    pool.query(sql, queryValues, (err, user) => {
        if (err) throw err;
        res.redirect(`/users/${req.params.id}`);
    })
});

////////// DELETE USER //////////
router.delete("/:id/delete", isAuthorized, (req, res) => {
    let sql = `
    DELETE FROM user WHERE id=?;
    DELETE FROM credential WHERE user_id=?`;
    pool.query(sql, [req.params.id, req.params.id], (err, user) => {
        if (err) throw err;
        res.send("Account succesfully deleted.");
    })
})

module.exports = router;