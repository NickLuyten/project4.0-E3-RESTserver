module.exports = (app) => {
  const autherizedUserPerMachine = require("../controllers/autherizedUserPerMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new autherizedUserPerMachine
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

  // Retrieve all autherizedUserPerMachine
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
  // Retrieve all autherizedUserPerMachine for a vending machine
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
  // Retrieve a single autherizedUserPerMachine with id
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

  // Delete a autherizedUserPerMachine with id
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
  // Delete a autherizedUserPerMachine with userId en vendingmachineId
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
