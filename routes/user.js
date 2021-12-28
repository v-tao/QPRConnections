const express = require("express"),
    router = express.Router();
const pool = require("../pool");
////////// GET USER //////////
router.get("/:id", (req, res) => {
    let sql = `SELECT * FROM users WHERE id=${req.params.id}`
    pool.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });
})

router.put("/:id", (req, res) => {
    let sql = `
    UPDATE users
    SET
    \`name\`="${req.body.name}",
    gender="${req.body.gender}",
    interestedGenders="${req.body.interestedGenders}",
    location=POINT(${req.body.location[0]}, ${req.body.location[1]}),
    distance=${req.body.distance},
    about="${req.body.about}",
    okActions="${req.body.okActions}",
    notOkActions="${req.body.notOkActions}"
    WHERE id=${req.params.id}
    `
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Account successfully updated.");
    })
});

router.delete("/:id/delete", (req, res) => {
    let sql = `DELETE FROM users WHERE id=${req.params.id}`;
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Account succesfully deleted.");
    })
})

module.exports = router;