const path = require('path');

// Configuración por defecto para SQLite (local)
const sqliteConfig = {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database/consecionaria.db'),
    logging: false,
    define: {
        timestamps: true,
        underscored: true
    }
};

// Si existe DATABASE_URL, asumimos Postgres en producción
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
    module.exports = sqliteConfig;
}
