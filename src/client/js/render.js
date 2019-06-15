import { CELL_SIZE, MAP_SIZE, PLAYER_SIZE, MAP_OBJECT, ITEM, ITEM_SIZE } from '../../shared/constants';
import { getAsset } from './assets';
import { getCurrentState } from './state';


const mapWrapper = document.querySelector('.js-game');
const canvas = document.querySelector('.js-game-canvas');
const context = canvas.getContext('2d');

const WIDTH = MAP_SIZE * CELL_SIZE;
const HEIGHT = MAP_SIZE * CELL_SIZE;
const PLAYER_COORD = (MAP_SIZE * CELL_SIZE - PLAYER_SIZE) / 2;
const PLAYER_SIZE_COMPENSATION = (CELL_SIZE - PLAYER_SIZE) / 2;
const ITEM_SIZE_COMPENSATION = (CELL_SIZE - ITEM_SIZE) / 2;
const CENTER_MAP_INDEX = Math.floor(MAP_SIZE / 2);
const MAP_WRAPPER_SIZE = WIDTH - 2 * CELL_SIZE;

mapWrapper.style.width = `${MAP_WRAPPER_SIZE}px`;
mapWrapper.style.height = `${MAP_WRAPPER_SIZE}px`;
canvas.style.marginLeft = `-${CELL_SIZE}px`;
canvas.style.marginTop = `-${CELL_SIZE}px`;

canvas.width = WIDTH;
canvas.height = HEIGHT;

let renderProcess = false;

let tickNumber = 0;

setInterval(() => {
    tickNumber++;
    if (tickNumber > 3) {
        tickNumber = 0;
    }
}, 200);

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
    renderPanel(me);
}

function renderMap(map, movementOffset) {
    if (!map) {
        return;
    }

    const wall = getAsset('block-block.svg');

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === MAP_OBJECT.WALL) {
                drawWall(wall, x, y, movementOffset);
            } else if (cell === ITEM.COIN) {
                drawItem(x, y, movementOffset);
            }
        });
    });
}

function drawWall(image, x, y, offset) {
    context.drawImage(
        image,
        x * CELL_SIZE - offset.x,
        y * CELL_SIZE - offset.y,
        CELL_SIZE,
        CELL_SIZE,
    );
}

function drawItem(x, y, offset) {
    context.fillStyle = 'yellow';
    context.fillRect(
        x * CELL_SIZE - offset.x + ITEM_SIZE_COMPENSATION,
        y * CELL_SIZE - offset.y + ITEM_SIZE_COMPENSATION,
        ITEM_SIZE,
        ITEM_SIZE
    )
}

function renderMe(me) {
    renderPlayer({
        ...me,
        x: PLAYER_COORD,
        y: PLAYER_COORD,
    })
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
        renderPlayer({
            ...player,
            x,
            y,
        })
    });
}

function renderPlayer({ direction, move, x, y, hit, injured }) {
    const playerImage = getAsset('mario-sprite.png');

    let sy = 0;
    if (direction === 'RIGHT') {
        sy = 80;
    } else if (direction === 'UP') {
        sy = 160;
    } else if (direction === 'LEFT') {
        sy = 240;
    }

    if (hit) {
        renderHit(x, y);
    }

    if (injured) {
        renderGetDamage(x, y);
    }

    context.drawImage(
        playerImage,
        move ? tickNumber * 80 : 0,
        sy,
        80,
        80,
        x,
        y,
        PLAYER_SIZE,
        PLAYER_SIZE
    );
}

function renderHit(x, y) {
    context.fillStyle = 'white';
    context.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
}

function renderGetDamage(x, y) {
    context.fillStyle = 'red';
    context.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
}

const panelX = 10 + CELL_SIZE;
const panelY = 10 + CELL_SIZE;

function renderPanel({ level, maxHp, hp, attack, speed, coins }) {
    context.fillStyle = 'white';
    context.fillRect(panelX, panelY, CELL_SIZE * (MAP_SIZE - 2) - 20, 30);

    context.font = '18px serif';
    context.fillStyle = 'black';
    // context.textBaseline = 'middle';
    // context.textAlign = 'center';
    // context.fillText(`${hp} / ${maxHp}`, hpWidth / 2 + panelX, hpHeight / 2 + panelY);

    context.fillText(`level: ${level}, maxHp: ${maxHp}, hp: ${hp}, attack: ${attack}, speed: ${speed}, coins: ${coins}`, panelX + 10, panelY + 20);
}

export const startRendering = () => {
    renderProcess = true;
    window.requestAnimationFrame(render);
};

export const stopRendering = () => {
    renderProcess = false;
};
