const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = require("./../../util/database");

const db = {};
db.url = dbConfig.url;

db.user = require("./user.model.js")(Sequelize, sequelize);
db.authentication = require("./authentication.model")(Sequelize, sequelize);
db.vendingMachine = require("./vendingMachine.model")(Sequelize, sequelize);
db.alert = require("./alert.model")(Sequelize, sequelize);
db.autherizedUserPerMachine = require("./autherizedUserPerMachine.model")(
  Sequelize,
  sequelize
);
db.userThatReceiveAlertsFromVendingMachine = require("./userThatReceiveAlertsFromVendingMachine.model")(
  Sequelize,
  sequelize
);
db.company = require("./company.model")(Sequelize, sequelize);
db.type = require("./type.model.js")(Sequelize, sequelize);
module.exports = db;
