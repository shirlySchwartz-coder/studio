 import { Config } from 'sequelize';
require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD ?? null,
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || undefined,
    dialect: 'mysql',
  },
};
export default config;
