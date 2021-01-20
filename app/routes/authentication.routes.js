module.exports = (app) => {
  const authentication = require("../controllers/authentication.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post("/", authJwt.verifyToken, authentication.create);

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    authentication.findAll
  );

  // Retrieve a single user with id
  router.get("/:id", authJwt.verifyToken, authentication.findOne);

  // Retrieve a single user with id
  router.get(
    "/authenticationString/:uuid",
    authJwt.verifyToken,
    authentication.findByAuthenticationString
  );

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
