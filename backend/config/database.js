const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/consecionaria.db'),
    logging: console.log, // Para ver las queries en consola
    define: {
        timestamps: true,
        underscored: true
    }
});

// Importar modelos
const User = require('../models/User');

// Sincronizar base de datos
const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Base de datos conectada');
        
        await sequelize.sync({ force: false }); // force: true resetea la DB
        console.log('✅ Modelos sincronizados');
    } catch (error) {
        console.error('❌ Error de base de datos:', error);
    }
};

module.exports = { sequelize, syncDatabase };