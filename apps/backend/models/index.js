const { Sequelize } = require('sequelize');
const Usuario = require('./usuarios');
const Vehiculo = require('./vehiculos');

const sequelize = new Sequelize('dealership', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

// Definir relaciones entre modelos
Usuario.hasMany(Vehiculo, {
  foreignKey: 'usuarioId',
  as: 'vehiculos'
});

Vehiculo.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'propietario'
});

const db = {
  Usuario,
  Vehiculo,
  sequelize,
  Sequelize
};

module.exports = db;