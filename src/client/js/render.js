import { CELL_SIZE, MAP_SIZE, PLAYER_SIZE, MAP_OBJECT } from '../../shared/constants';
import { getAsset } from './assets';
import { getCurrentState } from './state';


const mapWrapper = document.querySelector('.js-game');
const canvas = document.querySelector('.js-game-canvas');
const context = canvas.getContext('2d');

const WIDTH = MAP_SIZE * CELL_SIZE;
const HEIGHT = MAP_SIZE * CELL_SIZE;
const PLAYER_COORD = (MAP_SIZE * CELL_SIZE - PLAYER_SIZE) / 2;
const PLAYER_SIZE_COMPENSATION = (CELL_SIZE - PLAYER_SIZE) / 2;
const CENTER_MAP_INDEX = Math.floor(MAP_SIZE / 2);
const MAP_WRAPPER_SIZE = WIDTH - 2 * CELL_SIZE;

mapWrapper.style.width = `${MAP_WRAPPER_SIZE}px`;
mapWrapper.style.height = `${MAP_WRAPPER_SIZE}px`;
canvas.style.marginLeft = `-${CELL_SIZE}px`;
canvas.style.marginTop = `-${CELL_SIZE}px`;

canvas.width = WIDTH;
canvas.height = HEIGHT;

let renderProcess = false;

function render() {
    if (!renderProcess) {
        return;
    }
    const state = getCurrentState();
    renderBackground();
    renderObjects(state);
    window.requestAnimationFrame(render);
}

function renderBackground() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, WIDTH, HEIGHT);
}

function renderObjects(state) {
    const { me, players, map } = state;
    // надо компенсировать координаты всех объектов на карте, когда игрок находится не точно
    // в какой-то определеной клетке, а где-то между ними
    const movementOffset = {
        x: me.x - me.mapX * CELL_SIZE - PLAYER_SIZE_COMPENSATION,
        y: me.y - me.mapY * CELL_SIZE - PLAYER_SIZE_COMPENSATION,
    };
    renderMap(map, movementOffset);
    renderMe(me);
    renderPlayers(players, me, movementOffset);
}

function renderMap(map, movementOffset) {
    if (!map) {
        return;
    }

    const wall = getAsset('cell-wall.png');

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === MAP_OBJECT.WALL) {
                drawWall(wall, x, y, movementOffset);
            }
        });
    });
}

function drawWall(image, x, y, offset) {
    context.drawImage(
        image,
        0,
        0,
        200,
        200,
        x * CELL_SIZE - offset.x,
        y * CELL_SIZE - offset.y,
        CELL_SIZE,
        CELL_SIZE,
    );
}

function renderMe() {
    const playerImage = getAsset('player.svg');
    context.drawImage(playerImage, PLAYER_COORD, PLAYER_COORD, PLAYER_SIZE, PLAYER_SIZE);
}

function renderPlayers(players, me, movementOffset) {
    // расчитываем координаты других игроков относительно себя
    const offset = {
        x: (me.mapX - CENTER_MAP_INDEX) * CELL_SIZE + movementOffset.x,
        y: (me.mapY - CENTER_MAP_INDEX) * CELL_SIZE + movementOffset.y,
    };
    players.forEach((player) => {
        const x = player.x - offset.x;
        const y = player.y - offset.y;

        const playerImage = getAsset('player.svg');
        context.drawImage(playerImage, x, y, PLAYER_SIZE, PLAYER_SIZE);
    });
}

export const startRendering = () => {
    renderProcess = true;
    window.requestAnimationFrame(render);
};

export const stopRendering = () => {
    renderProcess = false;
};
