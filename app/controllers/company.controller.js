const db = require("./../models/index");
const Company = db.company;
const VendingMachine = db.vendingMachine;
const VendingMachineController = require("./vendingMachine.controller");

const User = db.user;
const UserController = require("./user.controller");

validateCompanyFields = (req, isRequired) => {
  // Validate request
  validationMessages = [];

  if (!req.body.name && isRequired) {
    validationMessages.push("name is required.");
  } else if (req.body.name) {
    if (req.body.name.length < 2) {
      validationMessages.push("name must be at least 2 characters");
    } else if (req.body.name.length > 24) {
      validationMessages.push("name can not be longer than 24 characters");
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

  if (!req.body.limitHandSanitizerReacedMessage && isRequired) {
    validationMessages.push("limitHandSanitizerReacedMessage is required.");
  }

  return validationMessages;
};

returnCompany = (data) => {
  return {
    result: {
      id: data.id,
      name: data.name,
      location: data.location,
      welcomeMessage: data.welcomeMessage,
      handGelMessage: data.handGelMessage,
      handGelOutOfStockMessage: data.handGelOutOfStockMessage,
      authenticationFailedMessage: data.authenticationFailedMessage,
      errorMessage: data.errorMessage,
      limitHandSanitizerReacedMessage: data.limitHandSanitizerReacedMessage,
    },
  };
};

returnCompanys = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      name: data.name,
      location: data.location,
      welcomeMessage: data.welcomeMessage,
      handGelMessage: data.handGelMessage,
      handGelOutOfStockMessage: data.handGelOutOfStockMessage,
      authenticationFailedMessage: data.authenticationFailedMessage,
      errorMessage: data.errorMessage,
      limitHandSanitizerReacedMessage: data.limitHandSanitizerReacedMessage,
    })),
  };
};

// Create and Save a new company
exports.create = (req, res) => {
  console.log("create function company");

  console.log(req.body.name + "  /  " + req.body.location);

  let validationMessages = validateCompanyFields(req, true);

  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  } else {
    let company = new Company({
      name: req.body.name,
      location: req.body.location,
      welcomeMessage: req.body.welcomeMessage,
      handGelMessage: req.body.handGelMessage,
      handGelOutOfStockMessage: req.body.handGelOutOfStockMessage,
      authenticationFailedMessage: req.body.authenticationFailedMessage,
      errorMessage: req.body.errorMessage,
      limitHandSanitizerReacedMessage: req.body.limitHandSanitizerReacedMessage,
    });
    console.log(company);
    company
      .save()
      .then((data) => {
        console.log("data");
        return res.send(returnCompany(data));
      })
      .catch((err) => {
        return res.status(500).send({
          message: err || "Error creating company",
        });
      });
  }
};

// Find a single company with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Company.findByPk(id)
    .then((data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found company with id " + id });
      else {
        console.log(data);
        return res.send(returnCompany(data));
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving company with id=" + id,
      });
    });
};

// Find all companies
exports.findAll = (req, res) => {
  Company.findAll()
    .then((company) => {
      if (!company)
        return res.status(400).send({ message: "No company found" });
      return res.send(returnCompanys(company));
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: err.message || "Error retrieving company" });
    });
};
//Update a company
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  const id = req.params.id;
  Company.findByPk(id).then((company) => {
    if (!company) {
      return res.status(400).send({
        message: `Cannot get company with id=${id}. Maybe company  was not found!`,
      });
    } else {
      company.update(req.body).then((updatedCompany) => {
        if (!updatedCompany) {
          return res.status(400).send({
            message: `Cannot updated company with id=${id}`,
          });
        } else {
          return res.send(returnCompany(updatedCompany));
        }
      });
    }
  });
};
// Delete a company with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  VendingMachine.findAll({
    where: {
      companyId: id,
    },
  })
    .then((vendingmachines) => {
      console.log("vending machnes");
      console.log(vendingmachines);
      for (let i = 0; i < vendingmachines.length; i++) {
        console.log("delete");
        console.log(vendingmachines[i].id);
        VendingMachineController.deleteLocal(req, res, vendingmachines[i].id);
      }
      User.findAll({
        where: {
          companyId: id,
        },
      })
        .then((users) => {
          console.log("users");
          console.log(users);
          for (let i = 0; i < users.length; i++) {
            console.log("delete");
            console.log(users[i].id);
            UserController.deleteLocal(req, res, users[i].id);
          }

          Company.findByPk(id)
            .then((company) => {
              if (!company) {
                return res.status(400).send({
                  message: `Cannot delete company with id=${id}. Maybe company was not found!`,
                });
              } else {
                company
                  .destroy()
                  .then(() => {
                    console.log("deleted company");
                    return res.send({
                      message: "company was deleted successfully!",
                    });
                  })
                  .catch((err) => {
                    return res.status(500).send({
                      message:
                        err.message || "Could not delete company with id=" + id,
                    });
                  });
              }
            })
            .catch((err) => {
              return res.status(500).send({
                message: err.message || "Could not find company with id=" + id,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message ||
              "there was an erro in deleting users of company with id=" + id,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "there was an erro in deleting vending machines of company with id=" +
            id,
      });
    });
};
