const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // límite de 5 intentos
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión. Por favor, intente nuevamente en 15 minutos.'
    }
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 100, // límite de 100 solicitudes por minuto
    message: {
        success: false,
        message: 'Demasiadas solicitudes realizadas. Por favor, intente nuevamente más tarde.'
    }
});

module.exports = {
    loginLimiter,
    apiLimiter
};
