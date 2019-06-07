const { MAP_SIZE } = require('../shared/constants');

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

class Maze {
    constructor() {
        this.map = map;
    }

    getVisibleMapForPlayer({mapX, mapY}) {
        const startIndexX = mapX - Math.floor(MAP_SIZE / 2);
        const startIndexY = mapY - Math.floor(MAP_SIZE / 2);
        const endIndexX = startIndexX + MAP_SIZE;
        const endIndexY = startIndexY + MAP_SIZE;

        const map = [];
        for (let i = startIndexY; i < endIndexY; i++) {
            const row = [];
            for (let j = startIndexX; j < endIndexX; j++) {
                if (this.map[i] !== undefined && this.map[i][j] !== undefined) {
                    row.push(this.map[i][j]);
                } else {
                    row.push(0);
                }
            }
            map.push(row);
        }

        return map;
    }
}

module.exports = Maze;
