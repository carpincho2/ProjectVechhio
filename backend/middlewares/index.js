const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');
const { errorResponse } = require('../utils/responses');

// Middleware de manejo de errores
exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    return errorResponse(res, err.status || 500, err.message || 'Error interno del servidor');
};

// Middleware de logging
exports.requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

// Middleware de autenticación JWT
exports.verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return errorResponse(res, 401, 'Token no proporcionado');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || config.auth.jwtSecret);
        
        // Verificar si el usuario sigue existiendo y está activo
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return errorResponse(res, 401, 'Usuario no encontrado');
        }

        req.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Token expirado');
        }
        return errorResponse(res, 401, 'Token inválido');
    }
};

// Middleware de roles
exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 401, 'Usuario no autenticado');
        }
        
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 403, 'Acceso denegado');
        }
        
        next();
    };
};

// Middleware de validación de archivos
exports.fileValidator = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const { maxFileSize, allowedTypes } = config.upload;
    
    if (req.file.size > maxFileSize) {
        return errorResponse(res, 400, 'Archivo demasiado grande');
    }
    
    if (!allowedTypes.includes(req.file.mimetype)) {
        return errorResponse(res, 400, 'Tipo de archivo no permitido');
    }
    
    next();
};

// Middleware de sanitización de datos
exports.sanitizeBody = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    next();
};

// Middleware de rate limiting
const rateLimit = require('express-rate-limit');
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por ventana
    message: 'Demasiadas solicitudes, por favor intente más tarde'
});

// Middleware de CORS personalizado
exports.corsMiddleware = (req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://projectvechhio.onrender.com'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
};