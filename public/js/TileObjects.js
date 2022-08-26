import { drawText, getRGBA, isCollisionPointPolygon, isCollisionPointRect } from "./utils.js"

export class TileObject {

    #presetProps = {
        fillStyle: null,
        strokeStyle: null,
        lineWidth: 3,
        font: "12px Verdana",
        textAlign: "center",
        fontColor: "white",
        fontBgColor: null,
        padding: 0,
        hoverFillStyle: null
    }

    constructor(poi) {
        for (let key of Object.keys(poi)) {
            //if (key === "class") this.className = poi["class"]
            this[key] = poi[key]
        }

        this.label = {
            offset: {
                x: 0,
                y: -25
            },
            color: "white",
            bgColor: "rgba(0,0,0,0.6)",
            padding: 10,
            font: "12px Verdana",
            textAlign: "center",
            position: "center"
        }

        this.#loadPresetProps()
        console.log(this)
    }

    getProp(name) {
        const CLASS_PROP = this.classProps ? this.classProps.find(prop => prop.name === name) : null
        const LAYER_PROP = this.layerProps ? this.layerProps.find(prop => prop.name === name) : null
        const TILE_PROP = this.properties ? this.properties.find(prop => prop.name === `ref_${name}` || (prop.name === name && prop.type != "bool")) : null

        return TILE_PROP ?? LAYER_PROP ?? CLASS_PROP ?? {}
    }

    #loadPresetProps() {
        for (let presetProp of Object.keys(this.#presetProps)) {
            const PROP = this.getProp(presetProp)
            if (PROP.value) this.#presetProps[presetProp] = PROP.value
        }
    }

    #getLabelLocation() {
        const LOC = {
            x: this.x + this.label.offset.x - this.label.padding,
            y: this.y + this.label.offset.y - this.label.padding
        }

        if (this.label.position === "center") {
            LOC.x += this.width / 2
        }

        return LOC
    }

    #drawLabel(context) {
        context.font = this.label.font

        const LOC = this.#getLabelLocation()
        
        drawText(context, this.name, LOC.x, LOC.y, {
            color: this.label.color,
            padding: this.label.padding,
            bgColor: this.label.bgColor,
            position: this.label.position,
            textAlign: this.label.textAlign
        })
    }

    isHovered() { return false }

    update(context, mouse) {
        if (!this.visible) return

        context.fillStyle = getRGBA(this.isHovered(mouse) ? this.#presetProps.hoverFillStyle : this.#presetProps.fillStyle)
        context.strokeStyle = getRGBA(this.#presetProps.strokeStyle)

        context.lineWidth = this.#presetProps.lineWidth
        
        context.beginPath()
        this.draw(context)
        if (this.#presetProps.fillStyle) context.fill()
        if (this.#presetProps.strokeStyle) context.stroke()
        context.closePath()

        if (this.name) this.#drawLabel(context)
    }
}
    
export class RectTileObject extends TileObject {
    draw(context) {
        context.rect(this.x, this.y, this.width, this.height)
    }

    isHovered(mouse) {
        return isCollisionPointRect(mouse, this)
    }
}

export class PointTileObject extends TileObject {
    constructor(poi) {
        super(poi)

        this.radius = this.getProp("radius").value
        this.label.offset.y = this.label.offset.y - this.radius
    }

    draw(context) {
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    }
}

export class PolygonTileObject extends TileObject {
    constructor(poi) {
        super(poi)
        this.polygon = this.#translatePolygon()
    }

    #translatePolygon() {
        const TRANSLATED_POLY = []
        for (let pointIndex = 0; pointIndex <= this.polygon.length - 1; pointIndex++) {
            TRANSLATED_POLY.push({
                x: this.polygon[pointIndex].x + this.x,
                y: this.polygon[pointIndex].y + this.y
            })
        }
        return TRANSLATED_POLY
    }

    draw(context) {
        context.moveTo(this.x, this.y)
        for (let pointIndex = 0; pointIndex <= this.polygon.length - 1; pointIndex++) {
            context.lineTo(this.polygon[pointIndex].x, this.polygon[pointIndex].y)
        }
        context.lineTo(this.x, this.y)
    }

    isHovered(mouse) {
        return isCollisionPointPolygon(mouse, this.polygon)
    }
}