module.exports = (Sequelize, sequelize) => {
    const UserThatReceiveAlertsFromVendingMachine = sequelize.define(
      "userThatReceiveAlertsFromVendingMachine",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
      }
    );
  
    return UserThatReceiveAlertsFromVendingMachine;
  };
  