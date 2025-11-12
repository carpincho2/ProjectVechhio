require('dotenv').config();
const path = require('path');

if (process.env.DATABASE_URL) {
    module.exports = {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
            handleDisconnects: true
        },
        retry: {
            max: 5,
            timeout: 5000
        },
        logging: false,
        define: {
            timestamps: true,
            underscored: true
        }
    };
} else {
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
