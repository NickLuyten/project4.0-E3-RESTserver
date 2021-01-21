module.exports = (app) => {
  const authentication = require("../controllers/authentication.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.hasUserPriviliges],
    authentication.create
  );
  router.post(
    "/guest/",
    [authJwt.verifyToken, authJwt.isAdmin],
    authentication.createQrCodeForUser
  );

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    authentication.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.hasUserPriviliges],
    authentication.findOne
  );

  // Retrieve a single user with id
  router.get(
    "/authenticationString/:uuid",
    authJwt.verifyToken,
    authentication.findByAuthenticationString
  );
  // Retrieve a single user with id
  router.get("/user/:id", authJwt.verifyToken, authentication.findByUserID);

  // Update a single user with id
  router.put(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    authentication.update
  );

  // Delete a user with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    authentication.delete
  );

  app.use("/api/authentication", router);
};
