import { getRGBA } from "./utils.js"

export class TileObject {
    constructor({ id, name, properties, rotation, x, y, layerProps }) {
        this.x = x
        this.y = y
        this.properties = properties
        this.rotation = rotation
        this.name = name
        this.id = id
        this.layerProps = layerProps
    }

    #getProp(name) {
        const LAYER_PROP = this.layerProps.find(prop => prop.name === name)

        const TILE_PROP = this.properties.find(prop => prop.name === `ref_${name}`)

        return TILE_PROP ?? LAYER_PROP
    }

    #handleBoolProp(prop, context) {
        const PROP = this.#getProp(prop.name)

        if (PROP?.type === "color") context.fillStyle = getRGBA(PROP.value)
    }

    update(context) {
        context.fillStyle = "rgba(0,0,0,0)"
        for (let prop of this.properties) {
            if (prop.name.includes("ref_")) continue
            switch (prop.type) {
                case "bool": 
                    if (prop.value) this.#handleBoolProp(prop, context)
                    break
                case "color":
                    context.fillStyle = getRGBA(prop.value)
            }
        }
        
        this.draw(context)
    }
}
    
export class RectTileObject extends TileObject {
    constructor({
        height,
        width,
        x,
        y,
        id,
        name,
        properties,
        rotation,
        layerProps
    }) {
        super({ id, name, properties, rotation, x, y, layerProps })
        this.width = width
        this.height = height
    }

    draw(context) {
        context.fillRect(this.x, this.y, this.width, this.height)
    }
}

export class PointTileObject extends TileObject {
    constructor({
        x,
        y,
        id,
        name,
        properties,
        layerProps
    }) {
        super({ id, name, properties, rotation: 0, x, y, layerProps })
    }

    draw(context) {
        context.fillRect(this.x - 2, this.y - 2, 5, 5)
    }
}