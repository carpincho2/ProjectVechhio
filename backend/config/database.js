const path = require('path');

// Si existe DATABASE_URL, usa Postgres en producción
if (process.env.DATABASE_URL) {
    module.exports = {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    };
} else {
    // Configuración para SQLite (desarrollo local)
    module.exports = {
        dialect: 'sqlite',
        storage: path.join(__dirname, '../../database/consecionaria.db'),
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    };
}
