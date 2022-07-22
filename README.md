# tile-map
Library for rending a given tile map from the tiled editor

## Features
- Dynamically renders json save of a map generated from tiled
- Allows for POIs to trigger click events

## Planed Feature
- Allow for rending worlds
- Allow multiple tilesets
- Handling rotating tiles
- Animated transitions between worlds
- Animated text boxes that will utilize paths
- Text boxes that can be linked to an object as the trigger ie. popups
- Tooltips

# About
This library is intended to be used on the client and have an API supply the json data for the rendering. Greate for tilemap games, or just creating an interactive web component easily with canvas and a grid system.

# Usage
Create a map in tiled with CSV enconding and export as a json with the tileset embedded. Then create a new TileMap(canvas_element, path_to_tileset, map_data)