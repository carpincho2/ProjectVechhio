'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPasswordAdmin = await bcrypt.hash('adminpassword', 10);
    const hashedPasswordUser = await bcrypt.hash('userpassword', 10);

    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'Admin User',
        email: 'admin@example.com',
        password: hashedPasswordAdmin,
        rol: 'admin',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Test User',
        email: 'user@example.com',
        password: hashedPasswordUser,
        rol: 'usuario',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('Vehiculos', [
      {
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2022,
        precio: 25000.00,
        kilometraje: 10000,
        color: 'Blanco',
        transmision: 'automática',
        combustible: 'gasolina',
        disponible: true,
        descripcion: 'Vehículo en excelente estado',
        imagenUrl: 'https://example.com/corolla.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        marca: 'Honda',
        modelo: 'Civic',
        año: 2023,
        precio: 28000.00,
        kilometraje: 5000,
        color: 'Negro',
        transmision: 'automática',
        combustible: 'gasolina',
        disponible: true,
        descripcion: 'Casi nuevo',
        imagenUrl: 'https://example.com/civic.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', null, {});
    await queryInterface.bulkDelete('Vehiculos', null, {});
  }
};
