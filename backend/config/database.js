const { Sequelize } = require('sequelize');
require('dotenv').config(); // Make sure .env variables are loaded

// Create a new Sequelize instance using your .env variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);

// Export the instance so other parts of your app can use it
module.exports = sequelize;