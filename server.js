const express = require("express"),

app = express()

app.use(express.static("public"))

app.use(express.json())

app.listen(3000)