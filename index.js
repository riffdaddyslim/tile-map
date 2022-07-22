const express = require("express")
const fs = require("fs")
const APP = express()

APP.use("/", express.static("./public"))

APP.get("/map", async (req, res) => {
    res.json(JSON.parse(fs.readFileSync(`./maps/parkinglot.json`)))
})

APP.listen("8000")
console.log(`App launched at http://localhost:8000`)