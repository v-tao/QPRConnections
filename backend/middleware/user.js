const pool = require("../pool");
const Errors = require("../error");
const f = require("./index").asyncWrapper;

const userExists = f(async function (req, res, next) {
    let sql = `SELECT * FROM user WHERE id=?`
    let [user] = await pool.query(sql, [req.params.id]);
    if (user.length == 0) {
        throw new Errors.NotFound("User");
    } else {
        next();
    }
})

module.exports = {userExists};