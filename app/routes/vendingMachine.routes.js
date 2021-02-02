module.exports = (app) => {
  const vendingMachine = require("../controllers/vendingMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new vendingmachine
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_CREATE_COMPANY),
    ],
    vendingMachine.create
  );

  // Retrieve all vendingmachine
  router.get(
    "/all",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_READ_COMPANY),
    ],
    vendingMachine.findAll
  );

  // test api key for vendingmachine
  router.get(
    "/testApiKey",
    authJwt.isVendingMachine,
    vendingMachine.testApiKey
  );

  // Retrieve a single vendingmachine with id
  router.get(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_READ_COMPANY),
    ],
    vendingMachine.findOne
  );

  //Retrieve all vendingmachines for company with id
  router.get(
    "/company/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_READ_COMPANY, 0, 1),
    ],
    vendingMachine.findVendingMachinesFromCompany
  );

  // Update a single vendingmachines with id
  router.put(
    "/update/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_UPDATE_COMPANY),
    ],
    vendingMachine.update
  );

  // Update the apikey for vendingmachines with id
  router.put(
    "/apiKey/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_UPDATE_COMPANY),
    ],
    vendingMachine.updateApiKey
  );

  //get hand gel
  router.put(
    "/handgelAfnemen",
    authJwt.isVendingMachine,
    vendingMachine.handgelAfhalen
  );

  //refill vending machine with id
  router.put(
    "/handgelBijVullen/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.VENDING_MACHINE_UPDATE_COMPANY) ||
        authJwt.hasPermission(permission.VENDING_MACHINE_UPDATE_COMPANY_REFILL),
    ],
    vendingMachine.handgelbijvullen
  );

  // Delete a vending machine with id
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
