let lastGameUpdate = {
    me: {
        x: 0,
        y: 0,
        level: 1,
    },
    map: null,
    players: [],
};

export function processGameUpdate(update) {
    lastGameUpdate = update;
}

export function getCurrentState() {
    return lastGameUpdate;
}
