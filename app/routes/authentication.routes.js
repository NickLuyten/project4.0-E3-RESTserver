module.exports = (app) => {
  const authentication = require("../controllers/authentication.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new user
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_CREATE_COMPANY_OWN),
    ],
    authentication.create
  );
  router.post(
    "/user/",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_CREATE_COMPANY),
    ],
    authentication.createQrCodeForUser
  );

  // Retrieve all users
  router.get(
    "/all",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY),
    ],
    authentication.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY),
    ],
    authentication.findOne
  );

  // Retrieve a single user with id
  router.get(
    "/authenticationString/:uuid",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY),
    ],
    authentication.findByAuthenticationString
  );
  // Retrieve a single user with id
  router.get(
    "/user/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_READ_COMPANY, 1),
    ],
    authentication.findByUserID
  );

  // Update a single user with id
  router.put(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.AUTHENTICATION_UPDATE_COMPANY),
    ],
    authentication.update
  );

  // Delete a user with id
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
