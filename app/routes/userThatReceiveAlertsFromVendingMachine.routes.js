module.exports = (app) => {
  const userThatReceiveAlertsFromVendingMachine = require("../controllers/userThatReceiveAlertsFromVendingMachine.Controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");
  // Create a new userThatReceiveAlertsFromVendingMachine
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE_COMPANY
      ),
    ],
    userThatReceiveAlertsFromVendingMachine.create
  );

  // Retrieve all userThatReceiveAlertsFromVendingMachine
  router.get(
    "/all",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ_COMPANY
      ),
    ],
    userThatReceiveAlertsFromVendingMachine.findAll
  );

  // Retrieve a single userThatReceiveAlertsFromVendingMachine with id
  router.get(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ_COMPANY
      ),
    ],
    userThatReceiveAlertsFromVendingMachine.findOne
  );

  // Delete a userThatReceiveAlertsFromVendingMachine with id
  router.delete(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE_COMPANY
      ),
    ],
    userThatReceiveAlertsFromVendingMachine.delete
  );

  app.use("/api/userThatReceiveAlertsFromVendingMachine", router);
};
