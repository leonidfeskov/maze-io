const { PLAYER_SPEED } = require('../shared/constants');

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.x = 0;
        this.y = 0;
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

    update(dt) {
        if (this.movement) {
            this.x += dt * this.speed * Math.sin(this.direction);
            this.y -= dt * this.speed * Math.cos(this.direction);
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
