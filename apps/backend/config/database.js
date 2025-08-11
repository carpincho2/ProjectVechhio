require('dotenv').config({ path: '../../.env' });
const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = isProduction
  ? new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './dev-database.sqlite',
    });

module.exports = sequelize;
