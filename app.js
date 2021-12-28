const express = require("express"),
    mysql = require("mysql");
    
const app = express();
app.use(express.json());
require("dotenv").config();

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "QPRConnections"
});

con.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to DB');
});

////////// CREATE USER //////////
app.post("/register", (req, res) => {
    let sql = `
    INSERT INTO users 
    (\`name\`, gender, interestedGenders, birthday, location, distance, about, okActions, notOkActions) 
    VALUES("${req.body.name}", "${req.body.gender}", "${req.body.interestedGenders}", DATE("${req.body.birthday}"), POINT(${req.body.location[0]}, ${req.body.location[1]}), ${req.body.distance}, "${req.body.about}", "${req.body.okActions}", "${req.body.notOkActions}")`;
    con.query(sql, (err, result) => {
        if(err) throw err;
        res.send("Account successfully created.")
    })
});

////////// GET USER //////////
app.get("/users/:id", (req, res) => {
    let sql = `SELECT * FROM users WHERE id=${req.params.id}`
    con.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });
});

////////// UPDATE USER //////////
app.put("/users/:id", (req, res) => {
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
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Account successfully updated.");
    })
});

app.listen(3000, function () {
    console.log("Server Started");
  });