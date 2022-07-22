import TileMap from "./TileMap.js"

const CANVAS = document.querySelector("canvas")
fetch(`/map`)
.then(res => {
    if (!res.ok) console.error(res.statusText)
    return res.json()
}).then(data => {
    
})

async function getMap() {
    return new Promise((resolve, reject) => {
        fetch(`/map`)
        .then(res => {
            if (!res.ok) console.error(res.statusText)
            return res.json()
        }).then(data => {
            resolve(data)
        })
    })
}

const TILE_MAP = new TileMap(CANVAS, "/images", await getMap())