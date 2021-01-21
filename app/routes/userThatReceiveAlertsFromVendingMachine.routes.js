module.exports = (app) => {
  const userThatReceiveAlertsFromVendingMachine = require("../controllers/userThatReceiveAlertsFromVendingMachine.Controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post(
    "/",
    authJwt.verifyToken,
    userThatReceiveAlertsFromVendingMachine.create
  );

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    userThatReceiveAlertsFromVendingMachine.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    authJwt.verifyToken,
    userThatReceiveAlertsFromVendingMachine.findOne
  );

  // Delete a user with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    userThatReceiveAlertsFromVendingMachine.delete
  );

  app.use("/api/userThatReceiveAlertsFromVendingMachine", router);
};
