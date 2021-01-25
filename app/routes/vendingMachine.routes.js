module.exports = (app) => {
  const vendingMachine = require("../controllers/vendingMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    vendingMachine.create
  );

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    vendingMachine.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    vendingMachine.findOne
  );

  router.get(
    "/company/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    vendingMachine.findVendingMachinesFromCompany
  );

  // Update a single user with id
  router.put(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    vendingMachine.update
  );

  //handgel afnemen
  router.put("/handgelAfnemen/:id", vendingMachine.handgelAfhalen);
  router.put("/handgelBijVullen/:id", vendingMachine.handgelbijvullen);

  // Delete a user with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    vendingMachine.delete
  );

  app.use("/api/vendingMachine", router);
};
