module.exports = (Sequelize, sequelize) => {
    const Authentication = sequelize.define("authentication", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      authentication: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });
  
    return Authentication;
  };
  