const path = require('path');

// Exporta solo el objeto de configuración.
// La instancia de Sequelize se creará en models/index.js
module.exports = {
    dialect: 'sqlite',
    // La ruta real a la base de datos se construirá en models/index.js
    // storage: path.join(__dirname, '../../database/consecionaria.db'),
    logging: false, // Se puede activar para debug: console.log
    define: {
        timestamps: true,
        underscored: true
    }
};
