const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dealership API',
      version: '1.0.0',
      description: 'API para la gestión de un concesionario de vehículos',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Rutas a documentar
  components: {
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID del usuario',
            example: 1
          },
          nombre: {
            type: 'string',
            description: 'Nombre del usuario',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            description: 'Email del usuario',
            example: 'john.doe@example.com'
          },
          password: {
            type: 'string',
            description: 'Contraseña del usuario',
            example: 'password123'
          },
          role: {
            type: 'string',
            description: 'Rol del usuario',
            example: 'user'
          }
        }
      },
      Vehiculo: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID del vehículo',
            example: 1
          },
          marca: {
            type: 'string',
            description: 'Marca del vehículo',
            example: 'Toyota'
          },
          modelo: {
            type: 'string',
            description: 'Modelo del vehículo',
            example: 'Corolla'
          },
          anio: {
            type: 'integer',
            description: 'Año del vehículo',
            example: 2022
          },
          precio: {
            type: 'number',
            description: 'Precio del vehículo',
            example: 25000
          },
          descripcion: {
            type: 'string',
            description: 'Descripción del vehículo',
            example: 'Vehículo en excelente estado'
          }
        }
      }
    }
  }
};

const specs = swaggerJsdoc(options);

module.exports = specs;
