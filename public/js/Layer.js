export class ImageLayer {
    #image = null

    constructor(image) {
        this.#image = image
    }

    draw(context) {
        if (this.#image) context.drawImage(this.#image, 0, 0)
    }
}

export class TileLayer {
    #layer = null
    #map = null

    constructor(layer, map) {
        this.#layer = layer
        this.#layer.tiles = this.#make2dArray(layer)
        this.#map = map
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
        return this.#map.tilesets[0]
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
        
        return [x * this.#map.tilewidth, y * this.#map.tileheight]
    }


    draw(context) {
        this.#layer.tiles.forEach((row, rowIndex) => {
            row.forEach((tileIndex, columnIndex) => {
                if (tileIndex === 0) return
                const [ sx, sy ] = this.#getTileCoords(tileIndex)
                context.drawImage(this.#getTileSet(tileIndex).image, sx, sy, this.#map.tilewidth, this.#map.tileheight, columnIndex * this.#map.tilewidth, rowIndex * this.#map.tileheight, this.#map.tilewidth, this.#map.tileheight)
            })
        })
    }
}