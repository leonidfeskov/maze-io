const { CELL_SIZE, PLAYER_SIZE } = require('../shared/constants');

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getCoordinates(x, y) {
    return {
        x: Math.floor(x / CELL_SIZE),
        y: Math.floor(y / CELL_SIZE),
    };
}

function getCell(map, x, y) {
    const coords = getCoordinates(x, y);
    return map[coords.y][coords.x];
}

function isIntersectBlock(player, map) {
    const cell1 = getCell(map, player.x, player.y);
    const cell2 = getCell(map, player.x + PLAYER_SIZE - 1, player.y);
    const cell3 = getCell(map, player.x, player.y + PLAYER_SIZE - 1);
    const cell4 = getCell(map, player.x + PLAYER_SIZE - 1, player.y + PLAYER_SIZE - 1);
    if (cell1 === 1 || cell2 === 1 || cell3 === 1 || cell4 === 1) {
        return true;
    }
}

module.exports = {
    random,
    getCoordinates,
    getCell,
    isIntersectBlock,
};
