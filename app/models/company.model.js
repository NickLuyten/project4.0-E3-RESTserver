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
  });

  return Company;
};
