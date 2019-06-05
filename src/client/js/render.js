import { PLAYER_SIZE } from '../../shared/constants';
import { getAsset } from './assets';
import { getCurrentState } from './state';


const canvas = document.querySelector('.js-game');
const context = canvas.getContext('2d');

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

console.log(WIDTH, HEIGHT);

canvas.width = WIDTH;
canvas.height = HEIGHT;

let renderProcess = false;

function render() {
    if (!renderProcess) {
        return;
    }
    const state = getCurrentState();
    renderBackground();
    renderPlayer(state.player);
    window.requestAnimationFrame(render);
}

function renderBackground() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function renderPlayer({ x, y }) {
    const playerImage = getAsset('player.svg');
    context.drawImage(playerImage, x, y, PLAYER_SIZE, PLAYER_SIZE);
}

export const startRendering = () => {
    renderProcess = true;
    window.requestAnimationFrame(render);
};

export const stopRendering = () => {
    renderProcess = false;
};
