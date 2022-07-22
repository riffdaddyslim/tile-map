/**
 * @file TileMap.js
 * @since 7/21/2022
 * @author Tyler Riffle
 * @description This is the file for the TileMap class
 */

/**
 * @typedef MapObject JSON object exported from Tiled when saving a map in json format
 */

/**
 * @typedef TileLayer Array of tile numbers for the tileset
 */

export default class TileMap {
    #canvas
    #context
    #tileset
    #currentMap

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {String} tilesetPath 
     * @param {MapObject} map 
     */
    constructor(canvas, tilesetPath, map) {
        this.#canvas = canvas
        this.#context = canvas.getContext("2d")

        this.#currentMap = map
        this.#tileset = map.tilesets[0]

        const SRC = `${tilesetPath}/${this.#tileset.image.split("/").pop()}`
        this.#tileset.image = new Image()
        this.#tileset.image.src = SRC

        this.#tileset.image.onload = () => {
            this.#drawLayers()
        }
    }

    /**
     * Formats the layer data array into a 2D array
     * @param {TileLayer} layer 
     * @returns {Array[]} 2d array of the layer to make calculating the tile location easier
     */
    #make2dArray(layer) {
        let arr_2d = []
        for (let i = 0; i < layer.data.length; i += layer.width) {
            arr_2d.push(layer.data.slice(i, i + layer.width))
        }
        return arr_2d
    }

    /**
     * Function to get the coordinates for the given tile index from the tilemap
     * @param {Number} tileIndex 
     * @returns {[x,y]} Array of the x,y coords that the tile is referencing in the tilemap
     */
    #getTileCoords(tileIndex) {
        let y = Math.floor(tileIndex / this.#tileset.columns)
        let x = 0

        if (tileIndex % this.#tileset.columns === 0) {
            x = this.#tileset.columns - 1
            y -= 1
        }
        else if (tileIndex > this.#tileset.columns) x = tileIndex % this.#tileset.columns - 1
        else x = tileIndex - 1
        
        return [x * this.#currentMap.tilewidth, y * this.#currentMap.tileheight]
    }
    
    /**
     * Function to draw a given layer
     * @param {TileLayer} layer The layer that will be drawn
     */
    #draw(layer) {
        layer.tiles.forEach((row, rowIndex) => {
            row.forEach((tileIndex, columnIndex) => {
                if (tileIndex === 0) return
                const [ sx, sy ] = this.#getTileCoords(tileIndex)
                this.#context.drawImage(this.#tileset.image, sx, sy, this.#currentMap.tilewidth, this.#currentMap.tileheight, columnIndex * this.#currentMap.tilewidth, rowIndex * this.#currentMap.tileheight, this.#currentMap.tilewidth, this.#currentMap.tileheight)
            })
        })
    }

    /**
     * Function to draw all the layers in the current map
     */
    #drawLayers() {
        for (let layer of this.#currentMap.layers) {
            layer.tiles = this.#make2dArray(layer)
            this.#draw(layer)
        }
    }
}