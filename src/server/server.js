const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const webpackConfig = require('../../webpack.config.js');
const { MESSAGE } = require('../shared/constants');

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

    socket.on(MESSAGE.JOIN_GAME, (userName) => {
        console.log('=== JOIN GAME ====', userName);
    });

    socket.on(MESSAGE.INPUT, (direction) => {
        console.log('=== DIRECTION ===', direction);
    })
});

