import { connect } from './networking';
import { downloadAssets } from './assets';
import { renderStart, renderStop } from './render';

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
        renderStart();
    //});
});
