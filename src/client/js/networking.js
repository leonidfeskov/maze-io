import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

import { MESSAGE } from '../../shared/constants';
import { processGameUpdate } from './state';

const socket = io(`ws://${window.location.host}`);

const connectedPromise = new Promise((resolve) => {
    socket.on('connect', () => {
        console.log('=== Connected to server ===');
        resolve();
    });
});

export const connect = (onGameOver) => {
    connectedPromise.then(() => {
        socket.on(MESSAGE.GAME_UPDATE, processGameUpdate);
        socket.on(MESSAGE.GAME_OVER, onGameOver);

        socket.on('disconnect', () => {
            console.log('=== Disconnected from server ===');
        });
    })
};

export const play = () => {
    socket.emit(MESSAGE.JOIN_GAME);
};

export const movePlayer = throttle(20, (direction) => {
    socket.emit(MESSAGE.PLAYER_MOVE, direction);
});

export const stopPlayer = () => {
    socket.emit(MESSAGE.PLAYER_STOP);
};
