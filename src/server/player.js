const { PLAYER_SPEED, CELL_SIZE, PLAYER_SIZE } = require('../shared/constants');
const { isIntersectBlock } = require('./utils');

const PLAYER_OFFSET = (CELL_SIZE - PLAYER_SIZE) / 2;

class Player {
    constructor(id, name, x, y) {
        this.id = id;
        this.name = name;
        this.x = x * CELL_SIZE + PLAYER_OFFSET;
        this.y = y * CELL_SIZE + PLAYER_OFFSET;
        this.direction = Math.PI / 2;
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
        if (this.movement) {
            const x = this.x + Math.round(dt * this.speed * Math.sin(this.direction));
            const y = this.y - Math.round(dt * this.speed * Math.cos(this.direction));
            if (!isIntersectBlock({x, y}, map)) {
                this.x = x;
                this.y = y;
            }
        }
    }

    getState() {
        return {
            x: this.x,
            y: this.y,
        }
    }
}

module.exports = Player;
