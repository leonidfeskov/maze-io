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

function isIntersectRect(rectA, rectB) {
    return !(
        rectB.x > rectA.x + rectA.size ||
        rectA.x > rectB.x + rectB.size ||
        rectB.y > rectA.y + rectA.size ||
        rectA.y > rectB.y + rectB.size
    );
}

function isIntersectWithPlayer(me, player) {
    return isIntersectRect(
        {x: me.x, y: me.y, size: PLAYER_SIZE},
        {x: player.x, y: player.y, size: PLAYER_SIZE}
    );
}

function isIntersectWithPlayers(me, players) {
    return Object.keys(players)
        .map((playerId) => {
            const player = players[playerId];
            if (player.id === me.id) {
                return false;
            }
            return isIntersectWithPlayer(me, player);
        })
        .some(Boolean);
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
    isIntersectWithPlayers,
    isIntersectBlock,
};
