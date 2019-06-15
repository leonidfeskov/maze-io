const { PLAYER_SPEED, PLAYER_HP, PLAYER_SIZE, PLAYER_HIT_COOLDOWN, CELL_SIZE, DAMAGE_DISTANCE } = require('../shared/constants');
const { getCoordinates } = require('./utils');

const PLAYER_OFFSET = (CELL_SIZE - PLAYER_SIZE) / 2;

const DIRECTION_MAPPING = {
    'UP': 0,
    'RIGHT': Math.PI / 2,
    'DOWN': Math.PI,
    'LEFT': -Math.PI / 2,
};

const setValueForShortTime = (player, value) => {
    player[value] = true;
    setTimeout(() => {
        player[value] = false;
    }, 100)
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
        this.hit = null;
        this.hitCooldown = false;
        this.maxHp = PLAYER_HP;
        this.hp = PLAYER_HP;
        this.injured = false;
    }

    move(direction) {
        this.direction = direction;
        this.movement = true;
    }

    stop() {
        this.movement = false;
    }

    makeHit() {
        if (!this.hitCooldown) {
            this.hitCooldown = true;
            setTimeout(() => {
                this.hitCooldown = false;
            }, PLAYER_HIT_COOLDOWN);

            setValueForShortTime(this, 'hit');
        }
    }

    getDamageRect() {
        const rect = {};
        switch (this.direction) {
            case 'RIGHT':
                rect.x = this.x + PLAYER_SIZE + 1;
                rect.y = this.y;
                rect.width = DAMAGE_DISTANCE;
                rect.height = PLAYER_SIZE;
                break;
            case 'LEFT':
                rect.x = this.x - DAMAGE_DISTANCE - 1;
                rect.y = this.y;
                rect.width = DAMAGE_DISTANCE;
                rect.height = PLAYER_SIZE;
                break;
            case 'DOWN':
                rect.x = this.x;
                rect.y = this.y + PLAYER_SIZE + 1;
                rect.width = PLAYER_SIZE;
                rect.height = DAMAGE_DISTANCE;
                break;
            case 'UP':
                rect.x = this.x;
                rect.y = this.y - DAMAGE_DISTANCE - 1;
                rect.width = PLAYER_SIZE;
                rect.height = DAMAGE_DISTANCE;
                break;
            default:
                break;
        }
        return rect;
    }

    getDamage() {
        this.hp--;
        setValueForShortTime(this,'injured');
        if (this.hp < 0) {
            this.hp = 0;
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
            injured: this.injured,
        }
    }
}

module.exports = Player;
