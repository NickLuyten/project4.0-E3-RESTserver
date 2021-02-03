module.exports = (Sequelize, sequelize) => {
  const Type = sequelize.define("type", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sanitizerLimitPerMonth: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Type;
};
