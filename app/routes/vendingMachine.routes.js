module.exports = (app) => {
  const vendingMachine = require("../controllers/vendingMachine.controller");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  // Create a new user
  router.post("/", authJwt.verifyToken, vendingMachine.create);

  // Retrieve all users
  router.get("/all", authJwt.verifyToken, vendingMachine.findAll);

  // Retrieve a single user with id
  router.get("/:id", authJwt.verifyToken, vendingMachine.findOne);

  // Update a single user with id
  router.put("/:id", authJwt.verifyToken, vendingMachine.update);

  //handgel afnemen
  router.put("/handgelAfnemen/:id", authJwt.verifyToken, vendingMachine.handgelAfhalen);

  // Delete a user with id
  router.delete("/:id", authJwt.verifyToken, vendingMachine.delete);

  app.use("/api/vendingMachine", router);
};
