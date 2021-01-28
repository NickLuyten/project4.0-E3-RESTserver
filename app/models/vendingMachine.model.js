module.exports = (Sequelize, sequelize) => {
  const vendingMachine = sequelize.define("vendingMachine", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    maxNumberOfProducts: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    welcomeMessage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    handGelMessage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    handGelOutOfStockMessage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    authenticationFailedMessage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    limitHandSanitizerReacedMessage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    errorMessage: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    alertLimit: {
      type: Sequelize.INTEGER,
    },
  });

  return vendingMachine;
};
