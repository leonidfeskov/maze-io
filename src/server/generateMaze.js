const { MAP_OBJECT } = require('../shared/constants');


const isInScope = (map, coord) => {
    return coord[0] >= 0 && coord[0] < map.length && coord[1] >= 0 && coord[1] < map[0].length;
};

const generateMaze = (width, height) => {
    // уменьшаем размер на 2 клетки, потому что потом добавим стены вокруг лабиринта
    width -= 2;
    height -= 2;

    const currentPosition = [0, 0];
    let map = [];
    let walls = [];

    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = MAP_OBJECT.WALL;
        }
    }

    function drawWay(y, x, addBlockWalls) {
        map[y][x] = MAP_OBJECT.EMPTY;
        if (addBlockWalls && isInScope(map, [y + 1, x]) && (map[y + 1][x] === MAP_OBJECT.WALL)) {
            walls.push([y + 1, x, [y, x]]);
        }
        if (addBlockWalls && isInScope(map, [y - 1, x]) && (map[y - 1][x] === MAP_OBJECT.WALL)) {
            walls.push([y - 1, x, [y, x]]);
        }
        if (addBlockWalls && isInScope(map, [y, x + 1]) && (map[y][x + 1] === MAP_OBJECT.WALL)) {
            walls.push([y, x + 1, [y, x]]);
        }
        if (addBlockWalls && isInScope(map, [y, x - 1]) && (map[y][x - 1] === MAP_OBJECT.WALL)) {
            walls.push([y, x - 1, [y, x]]);
        }
    }

    drawWay(currentPosition[0], currentPosition[1], true);

    while(walls.length !== 0) {
        let randomWall = walls[Math.floor(Math.random() * walls.length)];
        let host = randomWall[2];
        let opposite = [(host[0] + (randomWall[0]-host[0])*2), (host[1] + (randomWall[1]-host[1])*2)];
        if (isInScope(map, opposite)) {
            if (map[opposite[0]][opposite[1]] === MAP_OBJECT.EMPTY) {
                walls.splice(walls.indexOf(randomWall), 1);
            } else {
                drawWay(randomWall[0], randomWall[1], false);
                drawWay(opposite[0], opposite[1], true);
            }
        } else {
            walls.splice(walls.indexOf(randomWall), 1);
        }
    }

    // добавдяем стены вокруг всего лабиринта
    let horizontalBorder = [];
    for (let x = 0; x < width + 2; x++) {
        horizontalBorder.push(MAP_OBJECT.WALL);
    }
    for (let y = 0; y < height; y++) {
        map[y].push(MAP_OBJECT.WALL);
        map[y].unshift(MAP_OBJECT.WALL);
    }

    map.push(horizontalBorder);
    map.unshift(horizontalBorder);

    return map;
};

module.exports = generateMaze;



