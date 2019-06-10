const { PLAYER_SPEED, CELL_SIZE, PLAYER_SIZE } = require('../shared/constants');
const { isIntersectBlock, getCoordinates } = require('./utils');

const PLAYER_OFFSET = (CELL_SIZE - PLAYER_SIZE) / 2;

const DIRECTION_MAPPING = {
    'UP': 0,
    'RIGHT': Math.PI / 2,
    'DOWN': Math.PI,
    'LEFT': -Math.PI / 2,
};

class Player {
    constructor(id, mapX, mapY) {
        this.id = id;
        this.mapX = mapX;
        this.mapY = mapY;
        this.x = mapX * CELL_SIZE + PLAYER_OFFSET;
        this.y = mapY * CELL_SIZE + PLAYER_OFFSET;
        this.direction = 'RIGHT';
        this.speed = PLAYER_SPEED;
        this.movement = false;
    }

    move(direction) {
        this.direction = direction;
        this.movement = true;
    }

    stop() {
        this.movement = false;
    }

    update(dt, map) {
        const direction = DIRECTION_MAPPING[this.direction];
        if (this.movement) {
            const x = this.x + Math.round(dt * this.speed * Math.sin(direction));
            const y = this.y - Math.round(dt * this.speed * Math.cos(direction));
            if (!isIntersectBlock({x, y}, map)) {
                this.x = x;
                this.y = y;
                const coords = getCoordinates(x, y);
                this.mapX = coords.x;
                this.mapY = coords.y;
            }
        }
    }

    getState() {
        return {
            x: this.x,
            y: this.y,
            mapX: this.mapX,
            mapY: this.mapY,
            direction: this.direction,
            move: this.movement,
        }
    }
}

module.exports = Player;
