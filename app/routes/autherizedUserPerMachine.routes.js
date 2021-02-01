module.exports = (app) => {
  const autherizedUserPerMachine = require("../controllers/autherizedUserPerMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new user
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.AUTHERIZED_USER_PER_MACHINE_CREATE_COMPANY
      ),
    ],
    autherizedUserPerMachine.create
  );

  // Retrieve all users
  router.get(
    "/all",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.AUTHERIZED_USER_PER_MACHINE_READ_COMPANY
      ),
    ],
    autherizedUserPerMachine.findAll
  );
  // Retrieve all users for a vending machine
  router.get(
    "/vendingmachine/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.AUTHERIZED_USER_PER_MACHINE_READ_COMPANY
      ),
    ],
    autherizedUserPerMachine.findAllAuthenticatedUsersForVendingMachine
  );
  // Retrieve a single user with id
  router.get(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.AUTHERIZED_USER_PER_MACHINE_READ_COMPANY
      ),
    ],
    autherizedUserPerMachine.findOne
  );

  // Delete a user with id
  router.delete(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.AUTHERIZED_USER_PER_MACHINE_DELETE_COMPANY
      ),
    ],
    autherizedUserPerMachine.delete
  );

  router.delete(
    "/user/:userId/vendingmachine/:vendingMachineId",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(
        permission.AUTHERIZED_USER_PER_MACHINE_DELETE_COMPANY
      ),
    ],
    autherizedUserPerMachine.deleteWithVendingMachineAndUser
  );

  app.use("/api/autherizedUserPerMachine", router);
};
