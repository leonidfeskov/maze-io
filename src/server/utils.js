const { CELL_SIZE, PLAYER } = require('../shared/constants');

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
    if (map[coords.y] && map[coords.y][coords.x]) {
        return map[coords.y][coords.x];
    }
    return undefined;
}

function isIntersectWithPoint(point, rect) {
    return !(
        point.x > rect.x + PLAYER.SIZE ||
        point.x < rect.x ||
        point.y > rect.y + PLAYER.SIZE ||
        point.y < rect.y
    );
}

function isIntersectRect(rectA, rectB) {
    return !(
        rectB.x > rectA.x + rectA.width ||
        rectA.x > rectB.x + rectB.width ||
        rectB.y > rectA.y + rectA.height ||
        rectA.y > rectB.y + rectB.height
    );
}

function hitByPlayers(damageRect, players) {
    return Object.keys(players)
        .map((playerId) => {
            const player = players[playerId];
            if (isIntersectRect(damageRect, {...player, width: PLAYER.SIZE, height: PLAYER.SIZE})) {
                return playerId;
            }
            return null
        })
        .filter(Boolean);
}

function isIntersectWithPlayer(me, player) {
    return isIntersectRect(
        {x: me.x, y: me.y, width: PLAYER.SIZE, height: PLAYER.SIZE},
        {x: player.x, y: player.y, width: PLAYER.SIZE, height: PLAYER.SIZE}
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
    const cell2 = getCell(map, player.x + PLAYER.SIZE - 1, player.y);
    const cell3 = getCell(map, player.x, player.y + PLAYER.SIZE - 1);
    const cell4 = getCell(map, player.x + PLAYER.SIZE - 1, player.y + PLAYER.SIZE - 1);
    if (cell1 === 1 || cell2 === 1 || cell3 === 1 || cell4 === 1) {
        return true;
    }
}

module.exports = {
    random,
    getCoordinates,
    isIntersectWithPlayers,
    isIntersectBlock,
    isIntersectWithPoint,
    hitByPlayers,
};
