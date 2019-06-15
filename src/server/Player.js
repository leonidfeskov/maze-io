const { PLAYER_MAX_LEVEL, PLAYER_MIN_SPEED, PLAYER_MAX_SPEED, PLAYER_HP, PLAYER_ATTACK, PLAYER_SIZE, PLAYER_HIT_COOLDOWN, CELL_SIZE, DAMAGE_DISTANCE } = require('../shared/constants');
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

        this.level = 1;

        this.maxHp = PLAYER_HP;
        this.attack = PLAYER_ATTACK;
        this.speed = PLAYER_MAX_SPEED;

        this.movement = false;
        this.hit = null;
        this.hitCooldown = false;

        this.hp = PLAYER_HP;
        this.injured = false;

        this.coins = 0;
    }

    calculateStats() {
        const prevLevel = this.level;
        this.level = Math.min(PLAYER_MAX_LEVEL, Math.floor(Math.log2(this.coins)) + 1);
        this.maxHp = PLAYER_MAX_LEVEL - this.level + 1;
        this.attack = this.level;
        this.speed = Math.max(PLAYER_MIN_SPEED, PLAYER_MAX_SPEED - (this.level - 1) * 20);

        if (prevLevel !== this.level) {
            this.hp = this.maxHp;
        }
    }

    move(direction) {
        this.direction = direction;
        this.movement = true;
    }

    stop() {
        this.movement = false;
    }

    takeCoin() {
        this.coins++;
        this.calculateStats();
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
            injured: this.injured,

            level: this.level,
            maxHp: this.maxHp,
            attack: this.attack,
            hp: this.hp,
            speed: this.speed,

            coins: this.coins,
        }
    }
}

module.exports = Player;
