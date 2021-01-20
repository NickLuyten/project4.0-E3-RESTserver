module.exports = (Sequelize, sequelize) => {
  const AutherizedUserPerMachine = sequelize.define(
    "autherizedUserPerMachine",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    }
  );

  return AutherizedUserPerMachine;
};
