const express = require("express"),
    passport = require("passport"),
    router = express.Router();
const pool = require("../pool");

////////// GOOGLE LOGIN //////////
router.get("/login/google", passport.authenticate("google", {
    scope: ["profile"]
}));

router.get("/test", (req, res) => {
    res.send("poggers?");
})

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

module.exports = router;