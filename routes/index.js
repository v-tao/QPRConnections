const express = require("express"),
    passport = require("passport"),
    router = express.Router();
const pool = require("../pool");

////////// GOOGLE LOGIN //////////
router.get("/login/google", passport.authenticate("google", {
    scope: ["profile"]
}));

////////// GOOGLE AUTHENTICATION //////////
router.get("/oauth2/redirect/google", passport.authenticate("google", {
    failureRedirect: "/login/google"
}, (req, res) => {
    res.send("it worked");
}))

////////// CREATE USER //////////
router.post("/register", (req, res) => {
    let sql = `
    INSERT INTO users 
    (\`name\`, gender, interestedGenders, birthday, location, distance, about, okActions, notOkActions) 
    VALUES("${req.body.name}", "${req.body.gender}", "${req.body.interestedGenders}", DATE("${req.body.birthday}"), POINT(${req.body.location[0]}, ${req.body.location[1]}), ${req.body.distance}, "${req.body.about}", "${req.body.okActions}", "${req.body.notOkActions}")`;
    pool.query(sql, (err, result) => {
        if(err) throw err;
        res.send("Account successfully created.")
    })
});

module.exports = router;