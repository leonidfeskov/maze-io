const ASSETS_NAMES = [
    'pig-sprite1.png',
    'pig-sprite2.png',
    'pig-sprite3.png',
    'pig-sprite4.png',
    'pig-sprite5.png',
    'pig-sprite6.png',
    'pig-sprite7.png',
    'pig-sprite8.png',
    'pig-sprite9.png',
    'pig-sprite10.png',
    'coin-sprite.png',
    'heart-sprite.png',
    'sword-sprite.png',
    'boot.png',
    'wall.png',
    'floor.png',
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
