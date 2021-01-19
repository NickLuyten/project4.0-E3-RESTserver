const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = require("./../../util/database");

const db = {};
db.url = dbConfig.url;

db.user = require("./user.model.js")(Sequelize, sequelize);
// db.type = require("./type.model.js")(Sequelize, sequelize);
// db.team = require('./team.model.js')(mongoose);
// db.table = require('./table.model.js')(mongoose);
// db.player = require('./player.model.js')(mongoose);
// db.score = require('./score.model.js')(mongoose);
// db.match = require('./match.model.js')(mongoose);
module.exports = db;
