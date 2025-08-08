const { AppError } = require('../utils/errors/AppError');

const handleSequelizeValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    return new AppError(`Datos inválidos: ${errors.join('. ')}`, 400);
};

const handleJWTError = () =>
    new AppError('Token inválido. Por favor, inicie sesión nuevamente.', 401);

const handleJWTExpiredError = () =>
    new AppError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Errores operacionales: enviar mensaje al cliente
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    } 
    // Errores de programación: no enviar detalles al cliente
    else {
        // 1) Log error
        console.error('ERROR 💥', err);

        // 2) Enviar mensaje genérico
        res.status(500).json({
            success: false,
            message: 'Algo salió mal'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } 
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'SequelizeValidationError') error = handleSequelizeValidationError(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
