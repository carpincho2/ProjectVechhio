// Respuestas HTTP estandarizadas
exports.successResponse = (res, status = 200, data = null, message = 'Operación exitosa') => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

exports.errorResponse = (res, status = 500, message = 'Error interno del servidor', errors = null) => {
    return res.status(status).json({
        success: false,
        message,
        errors
    });
};

// Validaciones comunes
exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

exports.validatePassword = (password) => {
    // Mínimo 8 caracteres, al menos una letra y un número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

// Manejo de archivos
const fs = require('fs').promises;
const path = require('path');

exports.ensureDirectoryExists = async (dirPath) => {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
};

exports.removeFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        return true;
    } catch {
        return false;
    }
};

// Generación de nombres de archivo únicos
exports.generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(originalName);
    return `${timestamp}-${random}${ext}`;
};

// Paginación
exports.getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
        totalItems,
        items,
        totalPages,
        currentPage,
        itemsPerPage: limit
    };
};

// Filtrado seguro de objetos
exports.sanitizeObject = (obj, allowedFields) => {
    const sanitized = {};
    allowedFields.forEach(field => {
        if (obj[field] !== undefined) {
            sanitized[field] = obj[field];
        }
    });
    return sanitized;
};

// Generación de tokens
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.generateToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET || config.auth.jwtSecret,
        { expiresIn: '24h' }
    );
};

// Logger personalizado
exports.logger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
    },
    debug: (message, ...args) => {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
        }
    }
};

// Manejo de transacciones de base de datos
const { sequelize } = require('../models');

exports.withTransaction = async (callback) => {
    const t = await sequelize.transaction();
    try {
        const result = await callback(t);
        await t.commit();
        return result;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};