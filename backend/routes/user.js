const express = require("express"),
    router = express.Router();
const pool = require("../pool");
const {isLoggedIn, isAuthorized} = require("../middleware/index");

router.use(isLoggedIn);
////////// GET USERS //////////
// router.get("/", (req, res) => {
//     let sql = `
//     SELECT * FROM users 
//     WHERE
//     gender IN ${req.user.interstedGenders}
//     `
// })

////////// GET USER //////////
router.get("/:id", (req, res) => {
    let sql = `SELECT * FROM user WHERE id=?`
    pool.query(sql, [req.params.id], (err, result) => {
        if(err) throw err;
        res.json(result);
    });
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
    pool.query(sql, queryValues, (err, result) => {
        if (err) throw err;
        res.redirect(`/users/${req.params.id}`);
    })
});

router.delete("/:id/delete", isAuthorized, (req, res) => {
    let sql = `
    DELETE FROM user WHERE id=?;
    DELETE FROM credential WHERE user_id=?`;
    pool.query(sql, [req.params.id, req.params.id], (err, result) => {
        if (err) throw err;
        res.send("Account succesfully deleted.");
    })
})

module.exports = router;