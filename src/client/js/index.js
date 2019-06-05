import { connect } from './networking';
import { downloadAssets } from './assets';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';

const formLogin = document.querySelector('.js-form-login');
const userNameInput = document.querySelector('.js-user-name');
const buttonLogin = document.querySelector('.js-button-play');

Promise.all([
    connect(),
    downloadAssets(),
]).then(() => {
    //buttonLogin.addEventListener('click', (event) => {
        //event.preventDefault();
    console.log('=== PLAY ===');
    startCapturingInput();
    startRendering();

    //});
});
