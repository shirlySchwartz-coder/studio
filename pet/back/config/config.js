
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'pet_adoption',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'pet_adoption_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'pet_adoption_prod',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
};
