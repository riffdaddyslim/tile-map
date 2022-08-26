/**
 * @file TileMap.js
 * @since 7/21/2022
 * @author Tyler Riffle
 * @description This is the file for the TileMap class
 */

import { PointTileObject, PolygonTileObject, RectTileObject } from "./TileObjects.js"

/**
 * @typedef MapObject JSON object exported from Tiled when saving a map in json format
 */

/**
 * @typedef TileLayer Array of tile numbers for the tileset
 */

export default class TileMap {
    #canvas
    #context
    #currentMap
    #basePath
    #poi = new Set()

    #classes
    #maps

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {String} basePath 
     * @param {MapObject} map 
     */
    constructor(canvas, basePath, data) {
        this.#canvas = canvas
        this.#context = canvas.getContext("2d")

        this.#classes = data.classes
        this.#maps = data.maps

        this.#currentMap = this.#maps[0]
        this.#basePath = basePath

        this.#drawLayers()
    }

    #getImagePath(imagePath) {
        return `${this.#basePath}/${imagePath.split("/").pop()}`
    }

    #loadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const IMAGE = new Image()
            IMAGE.src = this.#getImagePath(imagePath)
            IMAGE.onload = () => {
                resolve(IMAGE)
            }
        })

        // this.#tileset = this.#currentMap.tilesets[0]

        // const SRC = this.#getImagePath(this.#tileset.image)
        // this.#tileset.image = new Image()
        // this.#tileset.image.src = SRC

        // this.#tileset.image.onload = () => {
        //     this.#canvas.width = this.#currentMap.width
        //     this.#canvas.height = this.#currentMap.height
        //     this.#drawLayers()
        // }
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

    #getTileSet(tileIndex) {
        return this.#currentMap.tilesets[0]
    }

    /**
     * Function to get the coordinates for the given tile index from the tilemap
     * @param {Number} tileIndex 
     * @returns {[x,y]} Array of the x,y coords that the tile is referencing in the tilemap
     */
    #getTileCoords(tileIndex) {
        let y = Math.floor(tileIndex / this.#getTileSet(tileIndex).columns)
        let x = 0

        if (tileIndex % this.#getTileSet(tileIndex).columns === 0) {
            x = this.#getTileSet(tileIndex).columns - 1
            y -= 1
        }
        else if (tileIndex > this.#getTileSet(tileIndex).columns) x = tileIndex % this.#getTileSet(tileIndex).columns - 1
        else x = tileIndex - 1
        
        return [x * this.#currentMap.tilewidth, y * this.#currentMap.tileheight]
    }
    
    /**
     * Function to draw a given layer
     * @param {TileLayer} layer The layer that will be drawn
     */
    #drawTileLayer(layer) {
        layer.tiles.forEach((row, rowIndex) => {
            row.forEach((tileIndex, columnIndex) => {
                if (tileIndex === 0) return
                const [ sx, sy ] = this.#getTileCoords(tileIndex)
                this.#context.drawImage(this.#getTileSet(tileIndex).image, sx, sy, this.#currentMap.tilewidth, this.#currentMap.tileheight, columnIndex * this.#currentMap.tilewidth, rowIndex * this.#currentMap.tileheight, this.#currentMap.tilewidth, this.#currentMap.tileheight)
            })
        })
    }

    #getPOI(poi) {
        if (poi.point) return new PointTileObject(poi)
        if (poi.polygon) return new PolygonTileObject(poi)
        return new RectTileObject(poi)
    }

    /**
     * Function to draw all the layers in the current map
     */
    async #drawLayers() {
            this.#canvas.width = this.#currentMap.width
            this.#canvas.height = this.#currentMap.height
        for (let layer of this.#currentMap.layers) {
            switch (layer.type) {
                case "objectgroup":
                    for (let object of layer.objects) {
                        this.#poi.add(this.#getPOI({
                            ...object,
                            layerProps: layer.properties,
                            classProps: object["class"] != "" ? this.#classes.find(cls => cls.name === object["class"]).members : null
                        }))
                    }
                    break
                case "imagelayer":
                    const IMAGE = await this.#loadImage(layer.image)
                    this.#context.drawImage(IMAGE, 0, 0)
                    break
                default:
                    layer.tiles = this.#make2dArray(layer)
                    this.#drawTileLayer(layer)
            }
        }

        for (let poi of this.#poi.values()) {
            poi.update(this.#context)
        }
    }
}