import { handleAuthInitialization } from './authLogic.js';

document.addEventListener('DOMContentLoaded', handleAuthInitialization);
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        handleAuthInitialization();
    }
});



