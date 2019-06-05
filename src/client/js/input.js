import { movePlayer, stopPlayer } from './networking'

const KEY_CODES_MAPPING = {
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
};

const KEY_CODES_FOR_MOVEMENT = [37, 38, 39, 40];

export const startCapturingInput = () => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
};

export const stopCapturingInput = () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
};

const pressedKeys = new Set();

function onKeyDown(event) {
    const { keyCode } = event;

    if (!KEY_CODES_FOR_MOVEMENT.includes(keyCode)) {
        return;
    }

    event.preventDefault();

    pressedKeys.add(keyCode);
    const direction = KEY_CODES_MAPPING[keyCode];
    movePlayer(direction);
}

function onKeyUp(event) {
    const { keyCode } = event;

    if (!KEY_CODES_FOR_MOVEMENT.includes(keyCode)) {
        return;
    }

    pressedKeys.delete(keyCode);
    if (!pressedKeys.size) {
        stopPlayer();
    } else {
        const lastPressedKey = [...pressedKeys].pop();
        const direction = KEY_CODES_MAPPING[lastPressedKey];
        movePlayer(direction);
    }
}
