module.exports = (app) => {
  const autherizedUserPerMachine = require("../controllers/autherizedUserPerMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    autherizedUserPerMachine.create
  );

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    autherizedUserPerMachine.findAll
  );
  // Retrieve all users for a vending machine
  router.get(
    "/vendingmachine/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    autherizedUserPerMachine.findAllAuthenticatedUsersForVendingMachine
  );
  // Retrieve a single user with id
  router.get("/:id", authJwt.verifyToken, autherizedUserPerMachine.findOne);

  // Delete a user with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    autherizedUserPerMachine.delete
  );

  app.use("/api/autherizedUserPerMachine", router);
};
