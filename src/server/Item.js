const { CELL_SIZE, ITEM_SIZE } = require('../shared/constants');

const ITEM_OFFSET = (CELL_SIZE - ITEM_SIZE) / 2;

class Item {
    constructor(name, mapX, mapY) {
        this.name = name;
        this.mapX = mapX;
        this.mapY = mapY;
        this.x = mapX * CELL_SIZE + ITEM_OFFSET;
        this.y = mapY * CELL_SIZE + ITEM_OFFSET;
    }

    getState() {
        return {
            name: this.name,
            x: this.x,
            y: this.y,
            mapX: this.mapX,
            mapY: this.mapY,
        }
    }
}

module.exports = Item;
