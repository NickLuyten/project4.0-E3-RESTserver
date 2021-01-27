module.exports = (app) => {
  const alert = require("../controllers/alert.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");
  // Retrieve all users
  router.post("/machineAbuse/:id", alert.machineMishandeld);

  //[authJwt.verifyToken||authJwt.hasPermission(permission.ALERT_CREATE)] is a test to see if the or statements works in the array
  router.get(
    "/alertsAuthUser",
    [
      authJwt.verifyToken ||
        authJwt.hasPermission(permission.ALERT_CREATE_COMPANY),
    ],
    alert.getAllAlertsFromUser
  );

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.hasPermission(permission.ALERT_READ_COMPANY)],
    alert.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.hasPermission(permission.ALERT_READ_COMPANY)],
    alert.findOne
  );

  // Update a single user with id
  //   router.put("/:id", authJwt.verifyToken, alert.update);

  // Delete a user with id
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
