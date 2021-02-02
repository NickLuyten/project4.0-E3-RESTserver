module.exports = (app) => {
  const alert = require("../controllers/alert.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");
  // alert for a specific vending machine that the machine is being abused
  router.post(
    "/machineAbuse",
    [authJwt.isVendingMachine],
    alert.machineMishandeld
  );

  //get all alerts where a user has access to
  router.get(
    "/alertsAuthUser",
    authJwt.verifyToken,
    alert.getAllAlertsFromUser
  );

  // get all allerts
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.hasPermission(permission.ALERT_READ_COMPANY)],
    alert.findAll
  );

  // get allert with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.hasPermission(permission.ALERT_READ_COMPANY)],
    alert.findOne
  );

  // Delete allert with id
  router.delete(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.ALERT_DELETE_COMPANY),
    ],
    alert.delete
  );

  app.use("/api/alert", router);
};
