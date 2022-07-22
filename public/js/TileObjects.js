import { drawText, getRGBA } from "./utils.js"

export class TileObject {
    constructor({ id, name, properties, rotation, x, y, width, height, layerProps }) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.properties = properties
        this.rotation = rotation
        this.name = name
        this.id = id
        this.layerProps = layerProps
    }

    #getProp(name) {
        const LAYER_PROP = this.layerProps.find(prop => prop.name === name)

        const TILE_PROP = this.properties.find(prop => prop.name === `ref_${name}` || (prop.name === name && prop.type != "bool"))

        return TILE_PROP ?? LAYER_PROP ?? {}
    }

    #handleBoolProp(prop, context) {
        const PROP = this.#getProp(prop.name)

        if (PROP?.type === "color") context.fillStyle = getRGBA(PROP.value)
    }

    #getLabelLocation() {
        const LOC = { x: this.x, y: this.y }

        LOC.x += this.#getProp("labelOffsetX").value ?? 0
        LOC.y += this.#getProp("labelOffsetY").value ?? 0

        if (this.#getProp("textPosition").value === "center") {
            LOC.x += this.width / 2
        }

        return LOC
    }

    draw(context) {
        context.font = this.#getProp("font").value ?? "12px Verdana"
        context.textAlign = this.#getProp("textAlign").value ?? "center"

        const LOC = this.#getLabelLocation()
        
        drawText(context, this.name, LOC.x, LOC.y, {
            color: getRGBA(this.#getProp("fontColor").value) ?? "white",
            padding: 0
        })
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
        super({ id, name, properties, rotation, x, y, width, height, layerProps })
    }

    draw(context) {
        context.fillRect(this.x, this.y, this.width, this.height)
        super.draw(context)
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
        super({ id, name, properties, rotation: 0, x, y, width: 5, height: 5, layerProps })
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, 5, 0, Math.PI * 2)
        context.fill()
        super.draw(context)
    }
}