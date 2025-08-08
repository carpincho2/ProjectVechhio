require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const sequelize = require('./backend/config/database.js');

// Importar rutas
const usuariosRoutes = require('./backend/routes/usuarios');
const vehiculosRoutes = require('./backend/routes/vehiculos');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./backend/config/swaggerConfig.js');

// Importar middlewares
const { apiLimiter } = require('./backend/middleware/rateLimiter');
const sanitizeInput = require('./backend/middleware/sanitize');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet()); // Seguridad de headers HTTP
app.use(cors()); // Habilitar CORS
app.use(express.json({ limit: '10kb' })); // Limitar tamaño de payload
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeInput); // Sanitización de entrada
app.use('/api', apiLimiter); // Rate limiting para API

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // Cache por 1 día
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}))

// Rutas principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
    next(new NotFoundError(`No se encontró la ruta ${req.originalUrl} en este servidor`));
});

// Manejador global de errores
const errorHandler = require('./backend/middleware/errorHandler');
app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
    console.log('Base de datos conectada')
  } catch (error) {
    console.error('Error al conectar la base de datos:', error)
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
  })
}

startServer()