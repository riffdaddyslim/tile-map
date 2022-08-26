const express = require("express")
const fs = require("fs")
const APP = express()

APP.use("/", express.static("./public"))

APP.get("/map", async (req, res) => {
    const DATA = {
        classes: JSON.parse(fs.readFileSync(`./Tiled/SCFair.tiled-project`)).propertyTypes,
        maps: []
    }

    const WORLD = JSON.parse(fs.readFileSync(`./Tiled/worlds/SCFair.world`))

    for (let map of WORLD.maps) {
        DATA.maps.push({
            ...JSON.parse(fs.readFileSync(`./Tiled/${map.fileName.replace("../", "")}`)),
            ...map
        })
    }

    res.json(DATA)
})

APP.listen("8000")
console.log(`App launched at http://localhost:8000`)