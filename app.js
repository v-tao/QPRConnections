const express = require("express"),
    session = require("express-session"),
    passport = require("passport"),
    GoogleStrategy = require("passport-google-oidc");
const indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user");
const app = express();
const pool = require("./pool.js")
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

////////// ROUTES //////////
app.use("/", indexRoutes);
app.use("/users", userRoutes);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "localhost:3000/oauth2/redirect/google"
}, (issuer, profile, cb) => {
    let sql = `SELECT * FROM credentials WHERE provider = ${issuer} AND subject = ${profile.id}`
    pool.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else if (!result) {
            let sql = `INSERT INTO users (name) VALUES(${profile.displayName})`;
            pool.query(sql, (err, result) => {
                if (err) return cb(err);
                let user = {
                    id: id.toString(),
                    name: profile.displayName
                };
                return cb(null, user);
            })
        } else {
            let sql = `SELECT * FROM users WHERE id= ${cred.userId}`;
            pool.query(sql, (err, result) => {
                if (err) throw err;
                if (!user) return cb(null, false);
                return cb(null, user);
            })
        }
    })
}))

require("dotenv").config();

app.listen(3000, function () {
    console.log("Server Started");
  });