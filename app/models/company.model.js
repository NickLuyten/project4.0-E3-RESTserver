module.exports = (Sequelize, sequelize) => {
  const Company = sequelize.define("company", {
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
    location: {
      type: Sequelize.STRING,
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
  });

  return Company;
};
