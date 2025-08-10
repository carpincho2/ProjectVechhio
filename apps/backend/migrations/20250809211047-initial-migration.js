'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rol: {
        type: Sequelize.ENUM('usuario', 'admin'),
        defaultValue: 'usuario',
        allowNull: false
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      ultimoLogin: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('Vehiculos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      marca: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      modelo: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      año: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      kilometraje: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      color: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      transmision: {
        type: Sequelize.ENUM('manual', 'automática'),
        allowNull: false
      },
      combustible: {
        type: Sequelize.ENUM('gasolina', 'diesel', 'eléctrico', 'híbrido'),
        allowNull: false
      },
      disponible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      imagenUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuarios');
    await queryInterface.dropTable('Vehiculos');
  }
};
