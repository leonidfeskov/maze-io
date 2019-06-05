let lastGameUpdate = {
    me: {
        x: 0,
        y: 0,
    },
    map: [[]],
    // players: [],
};

export function processGameUpdate(update) {
    lastGameUpdate = update;
}

export function getCurrentState() {
    return lastGameUpdate;
}
