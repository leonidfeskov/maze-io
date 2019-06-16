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

const images = {};

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
    images.pig = getAsset('pig-sprite.png');
    images.wall = getAsset('wall.png');
    images.coin = getAsset('coin-sprite.png');
    images.floor = getAsset('floor.png');
    images.heart = getAsset('heart-sprite.png');
    images.sword = getAsset('sword-sprite.png');
    images.boot = getAsset('boot.png');

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
    renderPanel(me);
}

function renderMap(map, movementOffset) {
    if (!map) {
        return;
    }

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            drawMapCell(images.floor, x, y, movementOffset);
        });
    });

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === MAP_OBJECT.WALL) {
                drawWall(images.wall, x, y, movementOffset);
            } else if (cell === ITEM.COIN) {
                drawCoin(images.coin, x, y, movementOffset);
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
    let sy = 0;
    if (direction === 'RIGHT') {
        sy = SPRITE_FRAGMET;
    } else if (direction === 'DOWN') {
        sy = SPRITE_FRAGMET * 2;
    } else if (direction === 'LEFT') {
        sy = SPRITE_FRAGMET * 3;
    }

    if (injured) {
        renderGetDamage(x, y);
    }

    context.drawImage(
        images.pig,
        move ? tickNumber * SPRITE_FRAGMET : 0,
        sy,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
        x,
        y,
        PLAYER.SIZE,
        PLAYER.SIZE
    );

    if (hit) {
        renderHit(x, y, direction);
    }
}

function renderHit(x, y, direction) {
    const result = {x, y, fragment: 0};
    switch (direction) {
        case 'UP': {
            result.x = x;
            result.y = y - PLAYER.DAMAGE_DISTANCE;
            break;
        }
        case 'RIGHT': {
            result.x = x + PLAYER.DAMAGE_DISTANCE;
            result.y = y;
            result.fragment = 1;
            break;
        }
        case 'DOWN': {
            result.x = x;
            result.y = y + PLAYER.DAMAGE_DISTANCE;
            result.fragment = 2;
            break;
        }
        case 'LEFT': {
            result.x = x - PLAYER.DAMAGE_DISTANCE;
            result.y = y;
            result.fragment = 3;
            break;
        }
        default:
            break;
    }
    context.drawImage(
        images.sword,
        0,
        SPRITE_FRAGMET * result.fragment,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
        result.x,
        result.y,
        ITEM_SIZE,
        ITEM_SIZE
    );
}

function renderGetDamage(x, y) {
    context.fillStyle = 'red';
    context.fillRect(x, y, PLAYER.SIZE, PLAYER.SIZE);
}

const PANEL_GAP = CELL_SIZE * 1.125;

function renderPanel({ level, maxHp, hp, attack, coins }) {
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.font = '24px Arial';
    renderCharacter(level);
    renderHP(maxHp, hp);
    renderStat(0, 'sword', attack);
    renderStat(1, 'boot', maxHp);
    renderCoins(coins)
}

function renderCharacter(level) {
    const center = PANEL_GAP + CELL_SIZE / 2;
    context.fillStyle = 'white';
    context.fillRect(PANEL_GAP, PANEL_GAP, CELL_SIZE, CELL_SIZE);
    context.drawImage(
        images.pig,
        0,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
        center - PLAYER.SIZE / 2,
        center - PLAYER.SIZE / 2,
        PLAYER.SIZE,
        PLAYER.SIZE,
    );
    const centerLevel = PANEL_GAP + CELL_SIZE / 4;
    context.fillStyle = 'black';
    context.fillText(level, centerLevel, centerLevel);
}

function renderHP(maxHP, hp) {
    const start = {
        x: PANEL_GAP + CELL_SIZE + 10,
        y: PANEL_GAP,
    };
    for (let i = 0; i < maxHP; i++) {
        context.drawImage(
            images.heart,
            hp > i ? 0 : SPRITE_FRAGMET,
            0,
            SPRITE_FRAGMET,
            SPRITE_FRAGMET,
            start.x + (ITEM_SIZE) * i,
            start.y,
            ITEM_SIZE,
            ITEM_SIZE,
        )
    }
}

function renderStat(position, imageName, value) {
    const width = ITEM_SIZE * 2;
    const x = PANEL_GAP + CELL_SIZE + 10 + (width + 10) * position;
    const y = PANEL_GAP + ITEM_SIZE;

    context.fillStyle = 'white';
    context.drawImage(
        images[imageName],
        0,
        0,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
        x,
        y,
        ITEM_SIZE,
        ITEM_SIZE,
    );
    renderText(value, x + ITEM_SIZE * 1.5, y + ITEM_SIZE / 2);
}

function renderCoins(coins) {
    const x = CELL_SIZE * (MAP_SIZE - 1) - CELL_SIZE * 0.125;
    const y = PANEL_GAP;

    context.fillStyle = 'white';
    context.drawImage(
        images.coin,
        0,
        0,
        SPRITE_FRAGMET,
        SPRITE_FRAGMET,
        x - ITEM_SIZE,
        y,
        ITEM_SIZE,
        ITEM_SIZE,
    );
    context.textAlign = 'right';
    renderText(coins, x - ITEM_SIZE - 10, y + ITEM_SIZE / 2);
}

function renderText(text, x, y) {
    context.fillStyle = 'black';
    context.fillText(text, x + 2, y + 2);
    context.fillStyle = 'white';
    context.fillText(text, x, y);
}

export const startRendering = () => {
    renderProcess = true;
    window.requestAnimationFrame(render);
};

export const stopRendering = () => {
    renderProcess = false;
};
