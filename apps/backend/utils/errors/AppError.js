class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'No estás autorizado') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

class DatabaseError extends AppError {
    constructor(message) {
        super(message, 500);
        this.name = 'DatabaseError';
    }
}

module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    NotFoundError,
    DatabaseError
};
