const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mssql",
    host: process.env.DB_HOST,
  }
);

module.exports = sequelize;
