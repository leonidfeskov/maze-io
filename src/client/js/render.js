import { getAsset } from './assets';
import { PLAYER_SIZE } from '../../shared/constants';

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
    renderBackground();
    renderPlayer(20, 20);
    window.requestAnimationFrame(render);
}

function renderBackground() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function renderPlayer(x, y) {
    const playerImage = getAsset('player.svg');
    context.drawImage(playerImage, x, y, PLAYER_SIZE, PLAYER_SIZE);
}

export const renderStart = () => {
    renderProcess = true;
    window.requestAnimationFrame(render);
};

export const renderStop = () => {
    renderProcess = false;
};
