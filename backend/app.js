const express = require("express"),
    session = require("express-session"),
    passport = require("passport"),
    GoogleStrategy = require("passport-google-oidc");
const indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user");
const app = express();
const pool = require("./pool.js");
const { createPoolCluster } = require("mysql");
require("dotenv").config();
app.use(express.json());
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookies: {secure: true},
}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser((id, done) => {
    let sql = `SELECT * FROM users WHERE id=${id}`;
    pool.query(sql, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/redirect/google"
}, (issuer, profile, cb) => {
    let sql = `SELECT * FROM credentials WHERE provider=? AND subject=?`;
    pool.query(sql, [issuer, profile.id], (err, result) => {
        if (err) throw err;
        if (result.length==0) {
            let sql = `INSERT INTO users (name) VALUES(?)`;
            pool.query(sql, [profile.displayName], (err, result) => {
                let id = result.insertId
                if (err) throw err;
                let sql = `INSERT INTO credentials SET ?`;
                let credential = {
                    userId: id,
                    provider: issuer,
                    subject: profile.id.toString()
                }
                pool.query(sql, credential, (err, result) => {
                    if(err) throw err;
                    let user = {
                        id: id,
                        name: profile.displayName
                    }
                    return cb(null, user);
                })
            });
        } else {
            let sql = `SELECT * FROM users WHERE id=?`
            pool.query(sql, [result[0].userId], (err, user) => {
                if (err) throw err;
                if (!user[0]) return cb(null, false);
                return cb(null, user[0]);
            })
        }
    })
}));

////////// ROUTES //////////
app.use("/", indexRoutes);
app.use("/users", userRoutes);

app.listen(3000, function () {
    console.log("Server Started");
  });