const { MESSAGE } = require('../shared/constants');
const Player = require('./player');
const Maze = require('./maze');
const { isIntersectBlock, isIntersectWithPlayers, hitByPlayers } = require('./utils');

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

    connectPlayer(socket) {
        const id = socket.id;
        this.sockets[id] = socket;
        const { x, y } = this.maze.getRandomEmptyCell();
        this.players[id] = new Player(id, x, y);
    }

    disconnectPlayer(socket) {
        this.removePlayer(socket.id)
    }

    removePlayer(id) {
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

    makeHitPlayer(socket) {
        const player = this.getPlayer(socket);
        if (player) {
            player.makeHit();
            const damageRect = player.getDamageRect();
            const playerIdsWhoGetDamage = hitByPlayers(damageRect, this.players);
            playerIdsWhoGetDamage.forEach((id) => {
                this.players[id].getDamage();
                this.removePlayerIfDead(id)
            });
        }
    }

    updatePlayers(dt) {
        Object.keys(this.sockets).forEach((playerId) => {
            const player = this.players[playerId];
            if (player.movement) {
                const newPosition = player.calculatePosition(dt);
                newPosition.id = playerId;
                if (
                    !isIntersectBlock(newPosition, this.maze.map) &&
                    !isIntersectWithPlayers(newPosition, this.players)
                ) {
                    player.update(newPosition);
                }
            }
        });
    }

    removePlayerIfDead(playerId) {
        const player = this.players[playerId];
        if (player.hp <= 0) {
            this.sockets[playerId].emit(MESSAGE.GAME_OVER);
            this.removePlayer(playerId);
        }
    }

    update() {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        this.updatePlayers(dt);

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
