require('dotenv').config();

module.exports = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'dealership',
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_DIALECT || 'mysql',
  storage: process.env.DB_STORAGE || './backend/dealership.sqlite',
  logging: false,
};