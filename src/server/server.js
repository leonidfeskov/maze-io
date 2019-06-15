const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const webpackConfig = require('../../webpack.config.js');
const { MESSAGE } = require('../shared/constants');
const Game = require('./Game');

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
    console.log('=== CONNECTED ===', socket.id);

    socket.on(MESSAGE.JOIN_GAME, joinPlayer);
    socket.on(MESSAGE.PLAYER_MOVE, movePlayer);
    socket.on(MESSAGE.PLAYER_STOP, stopPlayer);
    socket.on(MESSAGE.PLAYER_HIT, makeHitPlayer);
    socket.on('disconnect', onDisconnect);
});

const game = new Game();

function joinPlayer() {
    console.log('=== JOIN GAME ====');
    game.connectPlayer(this);
}

function movePlayer(direction) {
    game.movePlayer(this, direction);
}

function stopPlayer() {
    game.stopPlayer(this);
}

function makeHitPlayer() {
    game.makeHitPlayer(this);
}

function onDisconnect() {
    console.log('=== DISCONNECT ===');
    game.disconnectPlayer(this);
}


