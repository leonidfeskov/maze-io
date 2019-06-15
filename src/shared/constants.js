const mazeSize = 51;
const cellSize = 64;
const unitSize = cellSize * 0.5;

module.exports = Object.freeze({
    SPRITE_FRAGMET: 64,
    MAZE_SIZE: mazeSize,
    MAP_SIZE: 11,
    CELL_SIZE: cellSize,
    MAP_OBJECT: {
        EMPTY: 0,
        WALL: 1,
    },
    ITEM: {
        COIN: 10,
        LIFE: 11,
    },
    COIN_COUNT: Math.pow(Math.max(1, Math.floor(mazeSize/ 5)), 2),
    ITEM_SIZE: unitSize,
    PLAYER: {
        SIZE: unitSize,
        ATTACK: 1,
        MAX_SPEED: cellSize * 3,
        MIN_SPEED: cellSize,
        MAX_LEVEL: 10,
        HIT_COOLDOWN: 500,
        DAMAGE_DISTANCE: unitSize / 2,
    },
    MESSAGE: {
        DISCONNECT: 'disconnect',
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        PLAYER_MOVE: 'move',
        PLAYER_STOP: 'stop',
        PLAYER_HIT: 'hit',
        GAME_OVER: 'dead',
    },
});
