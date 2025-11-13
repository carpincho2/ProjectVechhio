const { body, param, query, validationResult } = require('express-validator');
const { validateEmail, validatePassword } = require('../utils');

// Validaciones de autenticación
exports.validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    body('email')
        .trim()
        .custom(validateEmail)
        .withMessage('Email inválido'),
    body('password')
        .custom(validatePassword)
        .withMessage('La contraseña debe tener al menos 8 caracteres, una letra y un número')
];

exports.validateLogin = [
    body('username').trim().notEmpty().withMessage('Usuario/Email requerido'),
    body('password').notEmpty().withMessage('Contraseña requerida')
];

// Validaciones de vehículos
exports.validateVehicle = [
    body('brand').trim().notEmpty().withMessage('Marca requerida'),
    body('model').trim().notEmpty().withMessage('Modelo requerido'),
    body('year')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage('Año inválido'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Precio debe ser un número positivo'),
    body('condition')
        .isIn(['nuevo', 'usado'])
        .withMessage('Condición debe ser nuevo o usado')
];

// Validaciones de finanzas
exports.validateFinance = [
    body('vehicleId').isInt().withMessage('ID de vehículo inválido'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Monto debe ser un número positivo'),
    body('months')
        .isInt({ min: 12, max: 60 })
        .withMessage('Plazo debe estar entre 12 y 60 meses')
];

// Validaciones de servicios
exports.validateService = [
    body('vehicleId').isInt().withMessage('ID de vehículo inválido'),
    body('serviceType')
        .isIn(['mantenimiento', 'reparacion', 'revision'])
        .withMessage('Tipo de servicio inválido'),
    body('date')
        .isISO8601()
        .withMessage('Fecha inválida')
];

// Validaciones comunes
exports.validateId = [
    param('id').isInt().withMessage('ID inválido')
];

exports.validatePagination = [
    query('page').optional().isInt({ min: 0 }).withMessage('Página inválida'),
    query('size').optional().isInt({ min: 1, max: 100 }).withMessage('Tamaño de página inválido')
];

// Validador de resultados
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: errors.array()
        });
    }
    next();
};