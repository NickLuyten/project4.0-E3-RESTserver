module.exports = (Sequelize, sequelize) => {
    const Type = sequelize.define("type", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });
  
    return Type;
  };
  