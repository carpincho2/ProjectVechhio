const request = require('supertest');
const express = require('express'); // Import express directly
const helmet = require('helmet');
const cors = require('cors');
const { sequelize } = require('../../models'); // Import sequelize instance

// Importar rutas
const usuariosRoutes = require('../../routes/usuarios');
const vehiculosRoutes = require('../../routes/vehiculos');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../../config/swaggerConfig.js');

// Importar middlewares
const { apiLimiter } = require('../../middleware/rateLimiter');
const sanitizeInput = require('../../middleware/sanitize');

describe('Usuarios API', () => {
  let app; // Declare app here

  // Create a new Express app for each test suite
  app = express();

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
  const { NotFoundError } = require('../../utils/errors/AppError');
  app.use((req, res, next) => {
        next(new NotFoundError(`No se encontró la ruta ${req.originalUrl} en este servidor`));
    });

  // Manejador global de errores
  const errorHandler = require('../../middleware/errorHandler');
  app.use(errorHandler);

  beforeAll(async () => {
    // Ensure database is synced before tests
    // await sequelize.sync({ force: true }); // Temporarily comment out for testing
  }, 90000); // Set timeout for beforeAll to 90 seconds

  afterAll(async () => {
    // Close database connection after tests
    // await sequelize.close(); // Temporarily comment out for testing
    // Explicitly close the server started by supertest
    if (app && app.server && app.server.close) {
      await new Promise(resolve => app.server.close(resolve));
    }
  });

  it('should create a new user', async () => {
    const newUser = {
      nombre: 'Integration Test User',
      email: 'integration@example.com',
      password: 'testpassword',
      rol: 'usuario'
    };

    const res = await request(app)
      .post('/api/usuarios')
      .send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toEqual(newUser.email);
  }, 30000); // Set timeout for this test to 30 seconds

  it('should get all users', async () => {
    const res = await request(app).get('/api/usuarios');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  }, 30000); // Set timeout for this test to 30 seconds

  // Add more tests for GET by ID, PUT, DELETE
});