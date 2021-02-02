module.exports = (app) => {
  const authentication = require("../controllers/authentication.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new authentication
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_CREATE_COMPANY_OWN),
    ],
    authentication.create
  );
  // Create a new authentication for a user
  router.post(
    "/user/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_CREATE_COMPANY),
    ],
    authentication.createQrCodeForUser
  );

  // Retrieve all authentications
  router.get(
    "/all",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY),
    ],
    authentication.findAll
  );

  // Retrieve a authentication with id
  router.get(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY),
    ],
    authentication.findOne
  );

  // Retrieve a authentication with uuid
  router.get(
    "/authenticationString/:uuid",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY),
    ],
    authentication.findByAuthenticationString
  );
  // Retrieve a authentication for a specific user with id
  router.get(
    "/user/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY, 1),
    ],
    authentication.findByUserID
  );

  // Update a authentication with id
  router.put(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_UPDATE_COMPANY),
    ],
    authentication.update
  );

  // Delete a authentication with id
  router.delete(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_DELETE_COMPANY),
    ],
    authentication.delete
  );

  app.use("/api/authentication", router);
};
