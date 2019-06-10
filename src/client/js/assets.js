const ASSETS_NAMES = [
    'mario-sprite.png',
    'player.svg',
    'cell-wall.png',
    'block-brick.svg',
    'block-block.svg',
];

const assets = {};

const downloadAsset = (assetName) => {
    return new Promise((resolve) => {
        const asset = new Image();
        asset.onload = () => {
            console.log(`=== DOWNLOAD ASSET ${assetName}===`);
            assets[assetName] = asset;
            resolve();
        };
        asset.src = `/assets/images/${assetName}`;
    });
};

export const downloadAssets = () => {
    return Promise.all(ASSETS_NAMES.map(downloadAsset));
};

export const getAsset = (assetName) => assets[assetName];
