module.exports = Object.freeze({
    MAP_SIZE: 7,
    MAZE_SIZE: 7,
    MAP_OBJECT: {
        EMPTY: 0,
        WALL: 1,
    },
    CELL_SIZE: 100,
    PLAYER_SIZE: 80,
    PLAYER_SPEED: 200,
    PLAYER_HP: 5,
    MESSAGE: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        PLAYER_MOVE: 'move',
        PLAYER_STOP: 'stop',
        PLAYER_HIT: 'hit',
        GAME_OVER: 'dead',
    },
});
