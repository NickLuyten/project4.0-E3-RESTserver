module.exports = (app) => {
  const autherizedUserPerMachine = require("../controllers/autherizedUserPerMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post("/", authJwt.verifyToken, autherizedUserPerMachine.create);

  // Retrieve all users
  router.get("/all", authJwt.verifyToken, autherizedUserPerMachine.findAll);

  // Retrieve a single user with id
  router.get("/:id", authJwt.verifyToken, autherizedUserPerMachine.findOne);

  // Delete a user with id
  router.delete("/:id", authJwt.verifyToken, autherizedUserPerMachine.delete);

  app.use("/api/autherizedUserPerMachine", router);
};
