const { MESSAGE } = require('../shared/constants');
const Player = require('./player');
const Map = require('./maps');

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
        this.map = new Map(1);

        setInterval(() => {
            this.update()
        }, FPS);
    }

    addPlayer(socket, userName) {
        const id = socket.id;
        this.sockets[id] = socket;
        this.players[id] = new Player(id, userName);
    }

    removePlayer(socket) {
        const id = socket.id;
        delete this.sockets[id];
        delete this.players[id];
    }

    movePlayer(socket, direction) {
        const id = socket.id;
        if (this.players[id]) {
            this.players[id].move(DIRECTION_MAPPING[direction]);
        }
    }

    stopPlayer(socket) {
        const id = socket.id;
        if (this.players[id]) {
            this.players[id].stop();
        }
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        // Update players position
        Object.keys(this.sockets).forEach((playerId) => {
            const player = this.players[playerId];
            player.update(dt);
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
            map: this.map.getState(),
            // players: Object.keys(this.players)
            //     .filter((playerId) => playerId !== player.id)
            //     .map((playerId) => this.players[playerId].getState())
            // ,
        };
    }
}

module.exports = Game;
