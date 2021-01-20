module.exports = (app) => {
  const alert = require("../controllers/alert.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Retrieve all users
  router.post("/machineAbuse/:id", authJwt.verifyToken, alert.machineMishandeld);

  // Retrieve all users
  router.get("/all", authJwt.verifyToken, alert.findAll);

  // Retrieve a single user with id
  router.get("/:id", authJwt.verifyToken, alert.findOne);

  // Update a single user with id
  //   router.put("/:id", authJwt.verifyToken, alert.update);

  // Delete a user with id
  router.delete("/:id", authJwt.verifyToken, alert.delete);

  app.use("/api/alert", router);
};
