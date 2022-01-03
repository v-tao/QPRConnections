const express = require("express"),
    passport = require("passport"),
    router = express.Router();
const pool = require("../pool");
const {isLoggedIn, isAuthenticated} = require("../middleware/index.js");

////////// TEST //////////
router.get("/test", (req, res) => {
  res.send("poggers?");
})

////////// GOOGLE LOGIN //////////
router.get("/login/google", passport.authenticate("google", {
    scope: ["profile"]
}));

////////// GOOGLE AUTHENTICATION //////////
router.get("/oauth2/redirect/google",
  passport.authenticate("google", { failureRedirect: "/", failureMessage: true }),
  (req, res) => {
    res.redirect("/test")
  });

////////// LOGOUT //////////
router.post("/logout", (req, res) => {
  req.logout();
  res.send("User successfully logged out.");
})

////////// REQUESTS SENT //////////
router.get("/sent", isLoggedIn, (req, res) => {
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

////////// REQUESTS RECEIVED //////////
router.get("/received", isLoggedIn, (req, res) => {
  let sql = `
  SELECT * FROM user LEFT JOIN user_request
  ON user.id=user_request.user_id
  WHERE user_request.requested_user_id=?
  `
  pool.query(sql, [req.user[0].id], (err, receivedRequests) => {
    if (err) throw err;
    res.json(receivedRequests);
  })
})

router.get("/my")
module.exports = router;