module.exports = (app) => {
  const type = require("../controllers/type.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new type
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.TYPE_CREATE_COMPANY),
    ],
    type.create
  );

  // Retrieve all type
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.hasPermission(permission.TYPE_READ_COMPANY)],
    type.findAll
  );

  //retreive all types for a company
  router.get(
    "/company/:id",
    [authJwt.verifyToken, authJwt.hasPermission(permission.TYPE_READ_COMPANY)],
    type.findAllTypesWithCompanyId
  );
  // Retrieve a type with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.hasPermission(permission.TYPE_READ_COMPANY)],
    type.findOne
  );

  // Update a type with id
  router.put(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.TYPE_UPDATE_COMPANY),
    ],
    type.update
  );

  // Delete a type with id
  router.delete(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.TYPE_DELETE_COMPANY),
    ],
    type.delete
  );

  app.use("/api/type", router);
};
