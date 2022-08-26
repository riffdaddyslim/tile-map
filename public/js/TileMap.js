/**
 * @file TileMap.js
 * @since 7/21/2022
 * @author Tyler Riffle
 * @description This is the file for the TileMap class
 */

import { ImageLayer, TileLayer } from "./Layer.js"
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
    #layers = []

    #classes
    #maps
    #mouse = {
        x: null,
        y: null,
        click: {
            x: null,
            y: null
        }
    }

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

        this.#linkEvents()
        this.#getLayers()
    }

    #linkEvents() {
        this.#canvas.addEventListener("mousemove", e => {
            this.#mouse.x = e.offsetX
            this.#mouse.y = e.offsetY
        })

        this.#canvas.addEventListener("click", e => {
            this.#mouse.click.x = e.offsetX
            this.#mouse.click.y = e.offsetY
        })
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

    #getPOI(poi) {
        if (poi.point) return new PointTileObject(poi)
        if (poi.polygon) return new PolygonTileObject(poi)
        return new RectTileObject(poi)
    }

    /**
     * Function to draw all the layers in the current map
     */
    async #getLayers() {
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
                    this.#layers.push(new ImageLayer(IMAGE))
                    break
                default:
                    this.#layers.push(new TileLayer(layer, this.#currentMap))
            }
        }

        this.animate()
    }

    animate() {
        this.#layers.forEach(layer => {
            layer.draw(this.#context)
        })

        this.#poi.forEach(poi => {
            poi.update(this.#context, this.#mouse)
        })

        requestAnimationFrame(() => { this.animate() })
    }
}