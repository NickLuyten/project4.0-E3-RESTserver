module.exports = (app) => {
  const company = require("../controllers/company.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();
  const permission = require("../const/permissions");

  // Create a new user
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.hasPermission(permission.COMPANY_CREATE)],
    company.create
  );

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.hasPermission(permission.COMPANY_READ)],
    company.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    [authJwt.verifyToken, authJwt.hasPermission(permission.COMPANY_READ, 0, 1)],
    company.findOne
  );

  // Update a single user with id
  router.put(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.COMPANY_UPDATE_COMPANY, 0, 1),
    ],
    company.update
  );

  // Delete a user with id
  router.delete(
    "/:id",
    [authJwt.verifyToken, authJwt.hasPermission(permission.COMPANY_DELETE)],
    company.delete
  );

  app.use("/api/company", router);
};
