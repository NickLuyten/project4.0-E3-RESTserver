module.exports = (app) => {
  const company = require("../controllers/company.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post("/", company.create);

  // Retrieve all users
  router.get("/all", [authJwt.verifyToken, authJwt.isAdmin], company.findAll);

  // Retrieve a single user with id
  router.get("/:id", [authJwt.verifyToken, authJwt.isAdmin], company.findOne);

  // Update a single user with id
  router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], company.update);

  // Delete a user with id
  router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], company.delete);

  app.use("/api/company", router);
};
