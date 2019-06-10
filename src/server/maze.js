const { MAP_SIZE, MAZE_SIZE, MAP_OBJECT } = require('../shared/constants');
const { random } = require('./utils');
const generateMaze  = require('./generateMaze');

const testMap = [
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
        this.map = generateMaze(MAZE_SIZE, MAZE_SIZE);
    }

    getRandomEmptyCell() {
        const randomCell = {};
        do {
            randomCell.x = random(1, MAZE_SIZE - 2);
            randomCell.y = random(1, MAZE_SIZE - 2);
        } while (this.map[randomCell.y][randomCell.x] !== MAP_OBJECT.EMPTY);
        return randomCell;
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
