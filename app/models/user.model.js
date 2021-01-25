module.exports = (Sequelize, sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: Sequelize.STRING,
    admin: Sequelize.BOOLEAN,
    guest: Sequelize.BOOLEAN,
    sanitizerLimitPerMonth: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  return User;
};
