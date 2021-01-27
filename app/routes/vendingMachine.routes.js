module.exports = (app) => {
  const vendingMachine = require("../controllers/vendingMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new user
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_CREATE_COMPANY),
    ],
    vendingMachine.create
  );

  // Retrieve all users
  router.get(
    "/all",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_READ_COMPANY),
    ],
    vendingMachine.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_READ_COMPANY),
    ],
    vendingMachine.findOne
  );

  router.get(
    "/company/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_READ_COMPANY, 0, 1),
    ],
    vendingMachine.findVendingMachinesFromCompany
  );

  // Update a single user with id
  router.put(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_UPDATE_COMPANY),
    ],
    vendingMachine.update
  );

  //handgel afnemen
  router.put("/handgelAfnemen/:id", vendingMachine.handgelAfhalen);
  router.put("/handgelBijVullen/:id", vendingMachine.handgelbijvullen);

  // Delete a user with id
  router.delete(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_UPDATE_COMPANY),
    ],
    vendingMachine.delete
  );

  app.use("/api/vendingMachine", router);
};
