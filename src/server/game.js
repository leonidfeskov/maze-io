const { MESSAGE, MAZE_SIZE } = require('../shared/constants');
const Player = require('./player');
const Maze = require('./maze');
const { getVisibleMap } = require('./maze');

const FPS = 1000 / 60;

const DIRECTION_MAPPING = {
    'UP': 0,
    'RIGHT': Math.PI / 2,
    'DOWN': Math.PI,
    'LEFT': -Math.PI / 2,
};

class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        this.maze = new Maze();

        setInterval(() => {
            this.update()
        }, FPS);
    }

    getPlayer(socket) {
        const id = socket.id;
        return this.players[id];
    }

    addPlayer(socket, userName) {
        const id = socket.id;
        this.sockets[id] = socket;
        // TODO сделать случайные координаты для игрока
        const center = Math.floor(MAZE_SIZE / 2);
        this.players[id] = new Player(id, userName, center, center);
    }

    removePlayer(socket) {
        const id = socket.id;
        delete this.sockets[id];
        delete this.players[id];
    }

    movePlayer(socket, direction) {
        const player = this.getPlayer(socket);

        if (player) {
            player.move(DIRECTION_MAPPING[direction]);
        }
    }

    stopPlayer(socket) {
        const player = this.getPlayer(socket);
        if (player) {
            player.stop();
        }
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        // Update players position
        Object.keys(this.sockets).forEach((playerId) => {
            const player = this.players[playerId];
            player.update(dt, this.maze.map);
        });

        // Send state to client
        if (this.shouldSendUpdate) {
            Object.keys(this.sockets).forEach((playerId) => {
                const socket = this.sockets[playerId];
                const player = this.players[playerId];
                socket.emit(MESSAGE.GAME_UPDATE, this.updateState(player));
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    updateState(player) {
        return {
            t: Date.now(),
            me: player.getState(),
            map: this.maze.getVisibleMapForPlayer(player),
            // players: Object.keys(this.players)
            //     .filter((playerId) => playerId !== player.id)
            //     .map((playerId) => this.players[playerId].getState())
            // ,
        };
    }
}

module.exports = Game;
