const { MESSAGE, ITEM, COIN_COUNT, ITEM_SIZE, MAP_OBJECT } = require('../shared/constants');
const Player = require('./Player');
const Maze = require('./Maze');
const Item = require('./Item');
const { isIntersectBlock, isIntersectWithPlayers, hitByPlayers, isIntersectWithPoint } = require('./utils');

const FPS = 1000 / 60;

class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        this.maze = new Maze();

        this.coins = {};
        for (let i = 0; i < COIN_COUNT; i++) {
            this.spawnCoin(i);
        }

        setInterval(() => {
            this.update();
        }, FPS);
    }

    spawnCoin(index) {
        const coord = this.maze.getRandomEmptyCell();
        this.maze.map[coord.y][coord.x] = ITEM.COIN;
        const id = new Date().getTime() + index;
        this.coins[id] = new Item(ITEM.COIN, coord.x, coord.y);
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
                Object.keys(this.coins).forEach((coinId) => {
                    const coin = this.coins[coinId];
                    const x = coin.x + (ITEM_SIZE / 2);
                    const y = coin.y + (ITEM_SIZE / 2);
                    if (isIntersectWithPoint({x, y}, newPosition)) {
                        player.takeCoin();
                        this.maze.map[coin.mapY][coin.mapX] = MAP_OBJECT.EMPTY;
                        delete this.coins[coinId];
                        this.spawnCoin(0);
                    }
                });
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
