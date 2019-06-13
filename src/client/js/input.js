import { movePlayer, stopPlayer, makeHitPlayer} from './networking'

const KEY_CODES_MAPPING = {
    32: 'HIT',
    37: 'LEFT',
    38: 'UP',
    39: 'RIGHT',
    40: 'DOWN',
};

const KEY_CODES_MOVE = [37, 38, 39, 40];
const KEY_CODE_HIT = 32;
const KEY_CODES_CONTROL = [KEY_CODE_HIT, ...KEY_CODES_MOVE];

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

    if (!KEY_CODES_CONTROL.includes(keyCode)) {
        return;
    }

    event.preventDefault();

    pressedKeys.add(keyCode);
    if (KEY_CODES_MOVE.includes(keyCode)) {
        const direction = KEY_CODES_MAPPING[keyCode];
        movePlayer(direction);
    }
    if (keyCode === KEY_CODE_HIT) {
        makeHitPlayer();
    }
}

function onKeyUp(event) {
    const { keyCode } = event;

    if (!KEY_CODES_CONTROL.includes(keyCode)) {
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
