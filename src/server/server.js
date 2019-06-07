const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const webpackConfig = require('../../webpack.config.js');
const { MESSAGE } = require('../shared/constants');
const Game = require('./game');

const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
} else {
    app.use(express.static('dist'));
}

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

io.on('connection', (socket) => {
    console.log('=== Player connected ===', socket.id);

    socket.on(MESSAGE.JOIN_GAME, joinPlayer);
    socket.on(MESSAGE.PLAYER_MOVE, movePlayer);
    socket.on(MESSAGE.PLAYER_STOP, stopPlayer);
    socket.on('disconnect', onDisconnect);
});

const game = new Game();

function joinPlayer(userName) {
    console.log('=== JOIN GAME ====', userName);
    game.addPlayer(this, userName);
}

function movePlayer(direction) {
    game.movePlayer(this, direction);
}

function stopPlayer() {
    game.stopPlayer(this);
}

function onDisconnect() {
    console.log('=== DISCONNECT ===');
    game.removePlayer(this);
}


