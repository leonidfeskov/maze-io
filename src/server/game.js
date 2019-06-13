const { MESSAGE } = require('../shared/constants');
const Player = require('./player');
const Maze = require('./maze');

const FPS = 1000 / 60;

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

    addPlayer(socket) {
        const id = socket.id;
        this.sockets[id] = socket;
        const { x, y } = this.maze.getRandomEmptyCell();
        this.players[id] = new Player(id, x, y);
    }

    removePlayer(socket) {
        const id = socket.id;
        delete this.sockets[id];
        delete this.players[id];
    }

    movePlayer(socket, direction) {
        const player = this.getPlayer(socket);

        if (player) {
            player.move(direction);
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
            player.update(dt, this.maze.map, this.players);
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
            players: Object.keys(this.players)
                .filter((playerId) => playerId !== player.id)
                .map((playerId) => this.players[playerId].getState())
            ,
        };
    }
}

module.exports = Game;
