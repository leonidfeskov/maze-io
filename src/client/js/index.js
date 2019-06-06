import { connect, play } from './networking';
import { downloadAssets } from './assets';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';

import '../css/styles.css'

Promise.all([
    connect(),
    downloadAssets(),
]).then(() => {
    console.log('=== PLAY ===');
    play('User');
    startCapturingInput();
    startRendering();
});
