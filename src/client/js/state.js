let lastGameUpdate = {
    player: {
        x: 0,
        y: 0,
    }
};

export function processGameUpdate(update) {
    lastGameUpdate = update;
}

export function getCurrentState() {
    return lastGameUpdate;
}
