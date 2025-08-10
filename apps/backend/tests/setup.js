const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { sequelize } = require('../models'); // Import sequelize from models/index.js

// Importar rutas
const usuariosRoutes = require('../routes/usuarios');
const vehiculosRoutes = require('../routes/vehiculos');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../config/swaggerConfig.js');

// Importar middlewares
const { apiLimiter } = require('../middleware/rateLimiter');
const sanitizeInput = require('../middleware/sanitize');

const app = express();

// Middlewares de seguridad
app.use(helmet()); // Seguridad de headers HTTP
app.use(cors()); // Habilitar CORS
app.use(express.json({ limit: '10kb' })); // Limitar tamaño de payload
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeInput); // Sanitización de entrada
app.use('/api', apiLimiter); // Rate limiting para API

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Manejo de rutas no encontradas
const { NotFoundError } = require('../utils/errors/AppError');
app.use((req, res, next) => {
    next(new NotFoundError(`No se encontró la ruta ${req.originalUrl} en este servidor`));
});

// Manejador global de errores
const errorHandler = require('../middleware/errorHandler');
app.use(errorHandler);

module.exports = app;