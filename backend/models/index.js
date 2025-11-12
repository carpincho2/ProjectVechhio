'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

// Cargar la configuración de la base de datos
const config = require('../config/database');

// Crear la instancia de Sequelize
const sequelize = new Sequelize(config.url || config, config);

// Leer todos los archivos del directorio actual (models)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    // Para cada archivo de modelo, inicializarlo y guardarlo en el objeto db
    // Se omite si el archivo está vacío
    if (fs.statSync(path.join(__dirname, file)).size > 0) {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });

// Si hay asociaciones entre modelos, se configurarían aquí
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Exportar la conexión (sequelize) y los modelos (db)
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
