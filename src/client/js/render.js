import { CELL_SIZE, MAP_SIZE, PLAYER, MAP_OBJECT, ITEM, ITEM_SIZE, SPRITE_FRAGMET } from '../../shared/constants';
import { getAsset } from './assets';
import { getCurrentState } from './state';


const mapWrapper = document.querySelector('.js-game');
const canvas = document.querySelector('.js-game-canvas');
const context = canvas.getContext('2d');

const WIDTH = MAP_SIZE * CELL_SIZE;
const HEIGHT = MAP_SIZE * CELL_SIZE;
const PLAYER_COORD = (MAP_SIZE * CELL_SIZE - PLAYER.SIZE) / 2;
const PLAYER_SIZE_COMPENSATION = (CELL_SIZE - PLAYER.SIZE) / 2;
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
}, 150);

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
    context.fillStyle = 'gray';
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
    // renderPanel(me);
}

function renderMap(map, movementOffset) {
    if (!map) {
        return;
    }

    const wall = getAsset('wall.png');
    const coin = getAsset('coin-sprite.png');
    const floor = getAsset('floor.png');

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            drawMapCell(floor, x, y, movementOffset);
        });
    });

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === MAP_OBJECT.WALL) {
                drawWall(wall, x, y, movementOffset);
            } else if (cell === ITEM.COIN) {
                drawCoin(coin, x, y, movementOffset);
            }
        });
    });
}

function drawMapCell(image, x, y, offset) {
    context.drawImage(
        image,
        x * CELL_SIZE - offset.x,
        y * CELL_SIZE - offset.y,
        CELL_SIZE,
        CELL_SIZE,
    );
}

const additionalSize3D = SPRITE_FRAGMET / 8;
function drawWall(image, x, y, offset) {
    context.drawImage(
        image,
        0,
        0,
        SPRITE_FRAGMET + additionalSize3D,
        SPRITE_FRAGMET + additionalSize3D,
        x * CELL_SIZE - offset.x,
        y * CELL_SIZE - offset.y,
        CELL_SIZE + additionalSize3D,
        CELL_SIZE + additionalSize3D,
    );
}

function drawCoin(image, x, y, offset) {
    context.drawImage(
        image,
        tickNumber * SPRITE_FRAGMET,
        0,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
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
    const playerImage = getAsset('pig-sprite.png');

    let sy = 0;
    if (direction === 'RIGHT') {
        sy = SPRITE_FRAGMET;
    } else if (direction === 'DOWN') {
        sy = SPRITE_FRAGMET * 2;
    } else if (direction === 'LEFT') {
        sy = SPRITE_FRAGMET * 3;
    }

    if (hit) {
        renderHit(x, y);
    }

    if (injured) {
        renderGetDamage(x, y);
    }

    context.drawImage(
        playerImage,
        move ? tickNumber * SPRITE_FRAGMET : 0,
        sy,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
        x,
        y,
        PLAYER.SIZE,
        PLAYER.SIZE
    );
}

function renderHit(x, y) {
    context.fillStyle = 'white';
    context.fillRect(x, y, PLAYER.SIZE, PLAYER.SIZE);
}

function renderGetDamage(x, y) {
    context.fillStyle = 'red';
    context.fillRect(x, y, PLAYER.SIZE, PLAYER.SIZE);
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
