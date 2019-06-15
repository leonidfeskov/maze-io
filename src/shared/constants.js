module.exports = Object.freeze({
    MAP_SIZE: 7,
    MAZE_SIZE: 7,
    CELL_SIZE: 100,
    MAP_OBJECT: {
        EMPTY: 0,
        WALL: 1,
    },
    ITEM: {
        COIN: 10,
        LIFE: 11,
    },
    COIN_COUNT: 2,
    ITEM_SIZE: 80,
    DAMAGE_DISTANCE: 40,
    PLAYER_SIZE: 80,
    PLAYER_SPEED: 200,
    PLAYER_HP: 5,
    PLAYER_HIT_COOLDOWN: 500,
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
