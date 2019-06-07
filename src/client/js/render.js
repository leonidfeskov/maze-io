import { CELL_SIZE, MAP_SIZE, PLAYER_SIZE } from '../../shared/constants';
import { getAsset } from './assets';
import { getCurrentState } from './state';


const canvas = document.querySelector('.js-game');
const context = canvas.getContext('2d');

const WIDTH = MAP_SIZE * CELL_SIZE;
const HEIGHT = MAP_SIZE * CELL_SIZE;

canvas.width = WIDTH;
canvas.height = HEIGHT;

let renderProcess = false;

function render() {
    if (!renderProcess) {
        return;
    }
    const state = getCurrentState();
    renderBackground();
    renderMap(state);
    renderMe(state.me);
    //renderPlayers(state.players);
    window.requestAnimationFrame(render);
}

function renderBackground() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

const playerSizeCompensation = (CELL_SIZE - PLAYER_SIZE) / 2;

function renderMap({ map, me }) {
    const playerOffsetX = me.x - me.mapX * CELL_SIZE - playerSizeCompensation;
    const playerOffsetY = me.y - me.mapY * CELL_SIZE - playerSizeCompensation;
    context.fillStyle = 'white';
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) {
                context.fillRect(x * CELL_SIZE - playerOffsetX, y * CELL_SIZE - playerOffsetY, CELL_SIZE, CELL_SIZE);
            }
        });
    });
}

const PLAYER_COORD = (MAP_SIZE * CELL_SIZE - PLAYER_SIZE) / 2;

function renderPlayer() {
    const playerImage = getAsset('player.svg');
    context.drawImage(playerImage, PLAYER_COORD, PLAYER_COORD, PLAYER_SIZE, PLAYER_SIZE);
}

function renderMe(player) {
    renderPlayer(player);
}

function renderPlayers(players) {
    players.forEach(renderPlayer);
}

export const startRendering = () => {
    renderProcess = true;
    window.requestAnimationFrame(render);
};

export const stopRendering = () => {
    renderProcess = false;
};
