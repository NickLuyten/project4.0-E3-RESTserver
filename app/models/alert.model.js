module.exports = (Sequelize, sequelize) => {
  const Alert = sequelize.define("alert", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    melding: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Alert;
};
