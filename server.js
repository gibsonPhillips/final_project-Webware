const express = require("express");
const cookie = require("cookie-session");
const path = require("path");

app = express();

app.use(
    cookie({
      name: "session",
      keys: ["verysecurekey(noitsnot)", "itssupersecureipromise"],
    })
);

app.use(express.static("./public"));

app.post("/login_request", async function (req, res) {
    console.log(req.session.login);
    req.session.login = true;
    res.redirect("index.html");
})

app.use(express.json())

app.listen(3000)