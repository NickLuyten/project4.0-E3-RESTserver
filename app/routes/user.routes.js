module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const { authJwt } = require("../middlewares");
  const permission = require("../const/permissions");
  // const multer = require("multer");
  // const multerConfig = require("../config/multer.config");

  var router = require("express").Router();

  // Create a new user
  // router.post('/register', multer({ storage: multerConfig.storage }).array('image'), users.create);
  router.post(
    "/register",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.USER_CREATE_COMPANY),
    ],
    users.create
  );
  router.post("/admin", users.createAdmin);

  // Authenticate user
  router.post("/authenticate", users.authenticate);

  // Create a new admin
  // router.post(
  //   '/admin',
  //   [authJwt.verifyToken, authJwt.hasPermission('ADMIN_CREATE')],
  //   multer({ storage: multerConfig.storage }).array('image'),
  //   users.createAdmin
  // );

  // Retrieve all users
  router.get(
    "/all",
    [authJwt.verifyToken, authJwt.hasPermission(permission.USER_READ_COMPANY)],
    users.findAll
  );

  // Retrieve a single user with id
  router.get(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.USER_READ_COMPANY, 1),
    ],
    users.findOne
  );
  router.get(
    "/handgelLimit/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.USER_READ_COMPANY, 1),
    ],
    users.handgelLimit
  );

  // Update a single user with id
  router.put(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.USER_UPDATE_COMPANY),
    ],
    users.update
  );

  // Update a single user with id
  router.put(
    "/updatePassword/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.USER_UPDATE_COMPANY, 1),
    ],
    users.updatePassword
  );

  // Delete a user with id
  router.delete(
    "/:id",
    [
      authJwt.verifyToken,
      authJwt.hasPermission(permission.USER_DELETE_COMPANY),
    ],
    users.delete
  );

  app.use("/api/user", router);
};
