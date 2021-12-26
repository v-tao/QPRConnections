const express = require("express"),
    app = express();

app.get("/", (req, res, next) => {
    res.send("test");
});

app.listen(3000, function () {
    console.log("Running on port 3000");
  });