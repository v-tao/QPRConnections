const express = require("express"),
    session = require("express-session"),
    passport = require("passport"),
    mysql = require("mysql2"),
    GoogleStrategy = require("passport-google-oidc");
const indexRoutes = require("./routes/index"),
    userRoutes = require("./routes/user"),
    requestRoutes = require("./routes/request");
    
const app = express();
const Errors = require("./error");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "QPRConnections",
    multipleStatements: true,
});

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
    let sql = `SELECT * FROM user WHERE id=${id}`
    con.query(sql, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/redirect/google"
}, (issuer, profile, cb) => {
    let sql = `SELECT * FROM credential WHERE provider=? AND subject=?`;
    con.query(sql, [issuer, profile.id], (err, result) => {
        if (err) throw err;
        if (result.length==0) {
            let sql = `INSERT INTO user (user_name) VALUES(?)`;
            con.query(sql, [profile.displayName], (err, result) => {
                let id = result.insertId
                if (err) throw err;
                let sql = `INSERT INTO credential SET ?`;
                let credential = {
                    user_id: id,
                    provider: issuer,
                    subject: profile.id.toString()
                }
                con.query(sql, credential, (err, result) => {
                    if(err) throw err;
                    let user = {
                        id: id,
                        user_name: profile.displayName
                    }
                    return cb(null, user);
                })
            });
        } else {
            let sql = `SELECT * FROM user WHERE id=?`;
            con.query(sql, [result[0].user_id], (err, user) => {
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
app.use("/requests", requestRoutes);

app.listen(3000, function () {
    console.log("Server Started");
  });