module.exports = Object.freeze({
    MAP_SIZE: 11,
    MAZE_SIZE: 31,
    MAP_OBJECT: {
        EMPTY: 0,
        WALL: 1,
    },
    CELL_SIZE: 80,
    PLAYER_SIZE: 50,
    PLAYER_SPEED: 200,
    MESSAGE: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        PLAYER_MOVE: 'move',
        PLAYER_STOP: 'stop',
        GAME_OVER: 'dead',
    },
});
