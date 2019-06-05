import { updatePosition } from './networking'

function onKeyDown(event) {
    const { keyCode } = event;

    if (![37, 38, 39, 40].includes(keyCode)) {
        return;
    }

    event.preventDefault();

    switch (keyCode) {
        case 37: {
            updatePosition('LEFT');
            break;
        }
        case 38: {
            updatePosition('UP');
            break;
        }
        case 39: {
            updatePosition('RIGHT');
            break;
        }
        case 40: {
            updatePosition('DOWN');
            break;
        }
        default:
            break;
    }
}

export const startCapturingInput = () => {
    document.addEventListener('keydown', onKeyDown);
};

export const stopCapturingInput = () => {
    document.removeEventListener('keydown', onKeyDown);
};
