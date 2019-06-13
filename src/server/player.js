const { PLAYER_SPEED, PLAYER_HP, PLAYER_SIZE, CELL_SIZE } = require('../shared/constants');
const { getCoordinates } = require('./utils');

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
        this.hit = false;
        this.maxHp = PLAYER_HP;
        this.hp = PLAYER_HP;
    }

    move(direction) {
        this.direction = direction;
        this.movement = true;
    }

    stop() {
        this.movement = false;
    }

    makeHit() {
        if (!this.hit) {
            this.hit = true;
            setTimeout(() => {
                this.hit = false;
            }, 500)
        }
    }

    calculatePosition(dt) {
        const direction = DIRECTION_MAPPING[this.direction];
        return {
            x: this.x + Math.round(dt * this.speed * Math.sin(direction)),
            y: this.y - Math.round(dt * this.speed * Math.cos(direction)),
        }
    }

    update({ x, y }) {
        this.x = x;
        this.y = y;
        const coords = getCoordinates(x, y);
        this.mapX = coords.x;
        this.mapY = coords.y;
    }

    getState() {
        return {
            x: this.x,
            y: this.y,
            mapX: this.mapX,
            mapY: this.mapY,
            direction: this.direction,
            move: this.movement,
            hit: this.hit,
            maxHp: this.maxHp,
            hp: this.hp,
        }
    }
}

module.exports = Player;
