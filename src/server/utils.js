const { CELL_SIZE, PLAYER_SIZE } = require('../shared/constants');

function getCell(map, x, y) {
    return map[Math.floor(y / CELL_SIZE)][Math.floor(x / CELL_SIZE)];
}

module.exports = {
    isIntersect: (a, b) => {
        return ;
    },
    isIntersectBlock: (player, map) => {
        const cell1 = getCell(map, player.x, player.y);
        const cell2 = getCell(map, player.x + PLAYER_SIZE - 1, player.y);
        const cell3 = getCell(map, player.x, player.y + PLAYER_SIZE - 1);
        const cell4 = getCell(map, player.x + PLAYER_SIZE - 1, player.y + PLAYER_SIZE - 1);
        console.log(cell1, cell2, cell3, cell4);
        if (cell1 === 1 || cell2 === 1 || cell3 === 1 || cell4 === 1) {
            return true;
        }
    }
};
