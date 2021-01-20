const db = require("./../models/index");
const VendingMachine = db.vendingMachine;
const Authentication = db.authentication;
//helper function to validate userfields
validateVendingMachineFields = (req, isRequired) => {
  // Validate request
  validationMessages = [];

  //First Name
  if (!req.body.name && isRequired) {
    validationMessages.push("name is required.");
  } else if (req.body.name) {
    if (req.body.name.length < 2) {
      validationMessages.push("name must be at least 2 characters");
    } else if (req.body.name.length > 24) {
      validationMessages.push("name can not be longer than 24 characters");
    }
  }

  //Last Name
  if (!req.body.maxNumberOfProducts && isRequired) {
    validationMessages.push("maxNumberOfProducts is required.");
  }
  if (!req.body.location && isRequired) {
    validationMessages.push("location is required.");
  } else if (req.body.location) {
    if (req.body.location.length < 2) {
      validationMessages.push("location must be at least 2 characters");
    }
  }

  if (!req.body.welcomeMessage && isRequired) {
    validationMessages.push("welcomeMessage is required.");
  } else if (req.body.welcomeMessage) {
    if (req.body.welcomeMessage.length < 2) {
      validationMessages.push("welcomeMessage must be at least 2 characters");
    }
  }

  if (!req.body.handGelMessage && isRequired) {
    validationMessages.push("handGelMessage is required.");
  } else if (req.body.handGelMessage) {
    if (req.body.handGelMessage.length < 2) {
      validationMessages.push("handGelMessage must be at least 2 characters");
    }
  }

  if (!req.body.handGelOutOfStockMessage && isRequired) {
    validationMessages.push("handGelOutOfStockMessage is required.");
  } else if (req.body.handGelOutOfStockMessage) {
    if (req.body.handGelOutOfStockMessage.length < 2) {
      validationMessages.push(
        "handGelOutOfStockMessage must be at least 2 characters"
      );
    }
  }

  if (!req.body.authenticationFailedMessage && isRequired) {
    validationMessages.push("authenticationFailedMessage is required.");
  } else if (req.body.authenticationFailedMessage) {
    if (req.body.authenticationFailedMessage.length < 2) {
      validationMessages.push(
        "authenticationFailedMessage must be at least 2 characters"
      );
    }
  }

  if (!req.body.errorMessage && isRequired) {
    validationMessages.push("errorMessage is required.");
  } else if (req.body.errorMessage) {
    if (req.body.errorMessage.length < 2) {
      validationMessages.push("errorMessage must be at least 2 characters");
    }
  }

  if (!req.body.stock && isRequired) {
    validationMessages.push("stock is required.");
  }

  return validationMessages;
};

//helper function to store user in db
storeVendingMachineInDatabase = (vendingMachine, res) => {
  vendingMachine
    .save(vendingMachine)
    .then((data) => {
      return res.send(returnVendingMachine(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the vending machine.",
      });
    });
};
returnVendingMachine = (data) => {
  return {
    result: {
      id: data.id,
      name: data.name,
      maxNumberOfProducts: data.maxNumberOfProducts,
      location: data.location,
      welcomeMessage: data.welcomeMessage,
      handGelMessage: data.handGelMessage,
      handGelOutOfStockMessage: data.handGelOutOfStockMessage,
      authenticationFailedMessage: data.authenticationFailedMessage,
      errorMessage: data.errorMessage,
      stock: data.stock,
    },
  };
};

returnVendingMachines = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      name: data.name,
      maxNumberOfProducts: data.maxNumberOfProducts,
      location: data.location,
      welcomeMessage: data.welcomeMessage,
      handGelMessage: data.handGelMessage,
      handGelOutOfStockMessage: data.handGelOutOfStockMessage,
      authenticationFailedMessage: data.authenticationFailedMessage,
      errorMessage: data.errorMessage,
      stock: data.stock,
    })),
  };
};

returnVendingMachines = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      name: data.name,
      maxNumberOfProducts: data.maxNumberOfProducts,
      location: data.location,
      welcomeMessage: data.welcomeMessage,
      handGelMessage: data.handGelMessage,
      handGelOutOfStockMessage: data.handGelOutOfStockMessage,
      authenticationFailedMessage: data.authenticationFailedMessage,
      errorMessage: data.errorMessage,
      stock: data.stock,
    })),
  };
};

// Create and Save a new user
exports.create = (req, res) => {
  console.log("create function : " + JSON.stringify(req.body));
  let validationMessages = validateVendingMachineFields(req, true);

  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  } else {
    // Create a user
    let vendingMachine = new VendingMachine({
      name: req.body.name,
      maxNumberOfProducts: req.body.maxNumberOfProducts,
      location: req.body.location,
      welcomeMessage: req.body.welcomeMessage,
      handGelMessage: req.body.handGelMessage,
      handGelOutOfStockMessage: req.body.handGelOutOfStockMessage,
      authenticationFailedMessage: req.body.authenticationFailedMessage,
      errorMessage: req.body.errorMessage,
      stock: req.body.stock,
    });

    VendingMachine.findOne({
      where: {
        name: req.body.name,
      },
    }).then((response) => {
      console.log("response : " + response);
      if (response == null || response.length == 0) {
        storeVendingMachineInDatabase(vendingMachine, res);
      } else {
        return res.status(400).send({
          message: `Already exists an vending machine with this name: ${vendingMachine.name}`,
        });
      }
    });
  }
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  VendingMachine.findByPk(id)
    .then((data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found vending machine with id " + id });
      else {
        console.log("data : " + JSON.stringify(data));
        return res.send(returnVendingMachine(data));
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Error retrieving vending machine with id=" + id });
    });
};

// Update a user
exports.update = async (req, res) => {
  let validationMessages = validateVendingMachineFields(req, false);
  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  }

  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  const id = req.params.id;
  VendingMachine.findByPk(id).then((vendingMachine) => {
    if (!vendingMachine) {
      return res.status(400).send({
        message: `Cannot get vending machine with id=${id}. Maybe vending machine was not found!`,
      });
    } else {
      vendingMachine.update(req.body).then((updatedVendingMachine) => {
        if (!updatedVendingMachine) {
          return res.status(400).send({
            message: `Cannot updated vending machine with id=${id}`,
          });
        } else {
          return res.send(returnVendingMachine(updatedVendingMachine));
        }
      });
    }
  });
};
//handgelafhalen
exports.handgelAfhalen = async (req, res) => {
  const id = req.params.id;

  const uuid = req.body.authentication;
  console.log("uuid");
  console.log(uuid);
  Authentication.findOne({
    where: {
      authentication: uuid,
      vendingMachineId: null,
    },
  })
    .then((authentication) => {
      if (!authentication)
        return res.status(400).send({
          message:
            "Not found authentication with authentication string " + uuid,
        });
      else {
        VendingMachine.findByPk(id)
          .then((vendingMachine) => {
            if (!vendingMachine) {
              return res.status(400).send({
                message: `Cannot get vending machine with id=${id}. Maybe vending machine was not found!`,
              });
            } else {
              if (vendingMachine.stock > 0) {
                vendingMachine.stock = vendingMachine.stock - 1;
                vendingMachine.save().then((updatedVendingMachine) => {
                  if (!updatedVendingMachine) {
                    return res.status(400).send({
                      message: `Cannot updated vending machine with id=${id}`,
                    });
                  } else {
                    authentication.vendingMachineId = vendingMachine.id;
                    authentication.save().then((data) => {
                      if (!data) {
                        return res.status(400).send({
                          message: `Cannot updated vending machine with id=${id}`,
                        });
                      } else {
                        return res.send(
                          returnVendingMachine(updatedVendingMachine)
                        );
                      }
                    });
                  }
                });
              } else {
                return res.status(400).send({
                  message: `the vending machine with id=${id} is out of stock.`,
                });
              }
            }
          })
          .catch((err) => {
            return res.status(500).send({
              message: err.message || "Error updating stock vending machines",
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Error retrieving authentication string with id=" +
          uuid +
          " error : " +
          err,
      });
    });
};

// Find all users
exports.findAll = (req, res) => {
  VendingMachine.findAll()
    .then((vendingMachines) => {
      if (!vendingMachines)
        return res.status(400).send({ message: "No vending machines found" });
      return res.send(returnVendingMachines(vendingMachines));
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: err.message || "Error retrieving vending machines" });
    });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  VendingMachine.findByPk(id)
    .then((vendingMachine) => {
      if (!vendingMachine) {
        return res.status(400).send({
          message: `Cannot delete vending machine with id=${id}. Maybe vending machine was not found!`,
        });
      } else {
        vendingMachine
          .destroy()
          .then(() => {
            return res.send({
              message: "vending machine was deleted successfully!",
            });
          })
          .catch((err) => {
            return res.status(500).send({
              message:
                err.message || "Could not delete vending machine with id=" + id,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Could not vending machine user with id=" + id,
      });
    });
};
