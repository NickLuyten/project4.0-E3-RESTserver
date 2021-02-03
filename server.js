const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");
const path = require("path");
const sequelize = require("./util/database");

const app = express();
//http://localhost:8081
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  // This check makes sure this is a JSON parsing issue, but it might be
  // coming from any middleware, not just body-parser:
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // console.error(err);
    //
    //
    return res.sendStatus(400); // Bad request
  }
  next();
});
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/images', express.static(path.join('app/files/images')));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "api loaded succesfully yeah :)" });
});

// First User, other tables may depend on this table
require("./app/routes/user.routes")(app);
require("./app/routes/vendingMachine.routes")(app);
require("./app/routes/authentication.routes")(app);
require("./app/routes/alert.routes")(app);
require("./app/routes/autherizedUserPerMachine.routes")(app);
require("./app/routes/userThatReceiveAlertsFromVendingMachine.routes")(app);
require("./app/routes/company.routes")(app);
require("./app/routes/type.routes")(app);

// db.user.belongsTo(db.type);
// db.type.hasMany(db.user);

db.user.belongsTo(db.company);
db.company.hasMany(db.user);

db.authentication.belongsTo(db.user);
db.authentication.belongsTo(db.vendingMachine);

db.user.belongsTo(db.type);
db.type.belongsTo(db.company);

db.userThatReceiveAlertsFromVendingMachine.belongsTo(db.user);
db.userThatReceiveAlertsFromVendingMachine.belongsTo(db.vendingMachine);
// db.user.belongsToMany(db.vendingMachine, {
//   through: db.authentication,
//   foreignKey: { name: "userId", allowNull: false, unique: false },
//   unique: false,
// });
// db.vendingMachine.belongsToMany(db.user, {
//   through: db.authentication,
//   foreignKey: { name: "vendingMachineId", allowNull: true, unique: false },
//   unique: false,
// });

db.alert.belongsTo(db.vendingMachine);
db.vendingMachine.hasMany(db.alert);
db.user.belongsToMany(db.vendingMachine, {
  through: db.autherizedUserPerMachine,
  foreignKey: { name: "userId", allowNull: false },
});
db.vendingMachine.belongsToMany(db.user, {
  through: db.autherizedUserPerMachine,
  foreignKey: { name: "vendingMachineId", allowNull: false },
});

db.vendingMachine.belongsTo(db.company);
db.company.hasMany(db.vendingMachine);

sequelize
  .sync() //{ force: true }
  .then((result) => {
    // set port, listen for requests
    console.log("connected to the database");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {});
  })
  .catch((err) => {
    console.log(err);
  });
