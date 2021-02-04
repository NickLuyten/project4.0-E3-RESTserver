const db = require("./../models/index");
const VendingMachine = db.vendingMachine;
const Authentication = db.authentication;
const Type = db.type;
const AutherizedUserPerMachine = db.autherizedUserPerMachine;
const Alert = db.alert;
const alertTypes = require("./../const/alertTypes");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const UserThatReceiveAlertsFromVendingMachine =
  db.userThatReceiveAlertsFromVendingMachine;
const Company = db.company;

const User = db.user;

const { authJwt } = require("../middlewares/index");
const permission = require("../const/permissions");
//helper function to validate vendingmachineFields
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

  if (!req.body.stock && isRequired) {
    validationMessages.push("stock is required.");
  }
  if (!req.body.limitHandSanitizerReacedMessage && isRequired) {
    validationMessages.push("limitHandSanitizerReacedMessage is required.");
  }
  if (!req.body.alertLimit && isRequired) {
    validationMessages.push("alertLimit is required.");
  }

  if (req.body.stock && req.body.maxNumberOfProducts) {
    if (
      isNaN(req.body.stock) ||
      isNaN(req.body.maxNumberOfProducts) ||
      Number(req.body.stock) > Number(req.body.maxNumberOfProducts)
    ) {
      validationMessages.push(
        "the vendingmachines stock can't be higher then it max number of products"
      );
    }
  }

  return validationMessages;
};

//helper function to store vendingmachine in db
storeVendingMachineInDatabase = (vendingMachine, res) => {
  vendingMachine
    .save(vendingMachine)
    .then((data) => {
      return res.send(returnVendingMachineWithApiKey(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the vending machine.",
      });
    });
};
returnVendingMachineWithApiKey = (data) => {
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
      limitHandSanitizerReacedMessage: data.limitHandSanitizerReacedMessage,
      alertLimit: data.alertLimit,
      stock: data.stock,
      companyId: data.companyId,
      apiKey: data.apiKey,
    },
  };
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
      limitHandSanitizerReacedMessage: data.limitHandSanitizerReacedMessage,
      alertLimit: data.alertLimit,
      stock: data.stock,
      companyId: data.companyId,
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
      limitHandSanitizerReacedMessage: data.limitHandSanitizerReacedMessage,
      alertLimit: data.alertLimit,
      stock: data.stock,
      companyId: data.companyId,
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
      limitHandSanitizerReacedMessage: data.limitHandSanitizerReacedMessage,
      alertLimit: data.alertLimit,
      stock: data.stock,
      companyId: data.companyId,
    })),
  };
};

exports.create = (req, res) => {
  console.log("create function : " + JSON.stringify(req.body));
  let validationMessages = validateVendingMachineFields(req, true);

  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  } else {
    console.log("req.body.companyId : " + req.body.companyId);
    Company.findByPk(req.body.companyId)
      .then((company) => {
        if (!company)
          return res.status(400).send({
            message: "The company for vendingmachine was not found",
          });
        else {
          if (
            !authJwt.checkIfPermission(req, permission.VENDING_MACHINE_CREATE)
          ) {
            if (req.authUser.companyId != company.id) {
              return res.status(400).send({
                message:
                  "Unautherized you can not create a vending machine for another company",
              });
            }
          }

          let vendingMachine = new VendingMachine({
            name: req.body.name,
            maxNumberOfProducts: req.body.maxNumberOfProducts,
            location: req.body.location,
            welcomeMessage: req.body.welcomeMessage,
            handGelMessage: req.body.handGelMessage,
            handGelOutOfStockMessage: req.body.handGelOutOfStockMessage,
            authenticationFailedMessage: req.body.authenticationFailedMessage,
            errorMessage: req.body.errorMessage,
            limitHandSanitizerReacedMessage:
              req.body.limitHandSanitizerReacedMessage,
            alertLimit: req.body.alertLimit,
            stock: req.body.stock,
            companyId: req.body.companyId,
            apiKey: uuidv4(),
          });
          storeVendingMachineInDatabase(vendingMachine, res);
        }
      })
      .catch((err) => {
        return res.status(500).send({
          message: "error creating vendingmachine error : " + err,
        });
      });
  }
};
exports.testApiKey = (req, res) => {
  if (req.authVendingMachine != null) {
    return res.send({ result: true });
  } else {
    return res.status(400).send({
      message: "test api key failed authVendingMachine doens't exist",
    });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  VendingMachine.findByPk(id)
    .then((data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found vending machine with id " + id });
      else {
        if (!authJwt.checkIfPermission(req, permission.VENDING_MACHINE_READ)) {
          if (req.authUser.companyId != data.companyId) {
            return res.status(401).send({
              message:
                "Unautherized you cannot look at a vending machine of another company",
            });
          }
        }
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

exports.findVendingMachinesFromCompany = (req, res) => {
  const id = req.params.id;
  VendingMachine.findAll({
    where: {
      companyId: id,
    },
  })
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

exports.update = async (req, res) => {
  let validationMessages = validateVendingMachineFields(req, false);

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
      if (req.body.stock || req.body.maxNumberOfProducts) {
        if (
          req.body.stock &&
          req.body.maxNumberOfProducts &&
          (isNaN(req.body.stock) ||
            isNaN(req.body.maxNumberOfProducts) ||
            Number(req.body.stock) > Number(req.body.maxNumberOfProducts))
        ) {
          console.log("test1");
          return res.status(400).send({
            message: `the vendingmachines stock can't be higher then it max number of products!`,
          });
        } else if (
          req.body.stock &&
          !req.body.maxNumberOfProducts &&
          (isNaN(req.body.stock) ||
            Number(req.body.stock) > Number(vendingMachine.maxNumberOfProducts))
        ) {
          return res.status(400).send({
            message: `the vendingmachines stock can't be higher then it max number of products!`,
          });
        } else if (
          req.body.maxNumberOfProducts &&
          !req.body.stock &&
          (isNaN(req.body.maxNumberOfProducts) ||
            Number(req.body.maxNumberOfProducts) < Number(vendingMachine.stock))
        ) {
          console.log("test3");
          return res.status(400).send({
            message: `the vendingmachines stock can't be higher then it max number of products!`,
          });
        }
      }
      if (!authJwt.checkIfPermission(req, permission.VENDING_MACHINE_UPDATE)) {
        if (vendingMachine.companyId != req.authUser.companyId) {
          return res.status(401).send({
            message: `unautherized to update the vending machine with id:${id}`,
          });
        }
        if (req.body.companyId) {
          if (req.body.companyId != req.authUser.companyId) {
            return res.status(401).send({
              message: `unautherized to update the vending machine with id:${id}`,
            });
          }
        }
      }
      vendingMachine.update(req.body).then((updatedVendingMachine) => {
        if (!updatedVendingMachine) {
          return res.status(400).send({
            message: `Cannot updated vending machine with id=${id}`,
          });
        } else {
          if (updatedVendingMachine.stock < 0) {
            console.log("alert melding ");
            vendingMachine.createAlert({
              type: alertTypes.stock,
              melding: "out of stock",
            });
          } else if (updatedVendingMachine.stock < 4) {
            console.log("alert melding ");
            vendingMachine.createAlert({
              type: alertTypes.stock,
              melding: "stock is running low",
            });
          } else if (
            updatedVendingMachine.stock ===
            updatedVendingMachine.maxNumberOfProducts
          ) {
            console.log("alert melding ");
            vendingMachine.createAlert({
              type: alertTypes.stock,
              melding: "stock is full",
            });
          }
          return res.send(returnVendingMachine(updatedVendingMachine));
        }
      });
    }
  });
};

exports.updateApiKey = async (req, res) => {
  const id = req.params.id;

  VendingMachine.findByPk(id).then((vendingMachine) => {
    if (!vendingMachine) {
      return res.status(400).send({
        message: `Cannot get vending machine with id=${id}. Maybe vending machine was not found!`,
      });
    } else {
      if (!authJwt.checkIfPermission(req, permission.VENDING_MACHINE_UPDATE)) {
        if (vendingMachine.companyId != req.authUser.companyId) {
          return res.status(401).send({
            message: `unautherized to update the vending machine with id:${id}`,
          });
        }
      }
      vendingMachine.apiKey = uuidv4();
      vendingMachine.save().then((updatedVendingMachine) => {
        if (!updatedVendingMachine) {
          return res.status(400).send({
            message: `Cannot updated vending machine with id=${id}`,
          });
        } else {
          return res.send(
            returnVendingMachineWithApiKey(updatedVendingMachine)
          );
        }
      });
    }
  });
};

userAutherizedForVendingmachine = (userId, vendingMachineId) => {
  UserAutherizedForVendingmachine.findOne({
    where: {
      userId: userId,
      vendingMachineId: vendingMachineId,
    },
  }).then((userAutherizedForVendingmachine) => {
    if (!userAutherizedForVendingmachine) {
      return res.status(400).send({
        message:
          err.message || "Error user not autherized for vending machines",
      });
    } else {
    }
  });
};

exports.handgelAfhalen = async (req, res) => {
  const id = req.authVendingMachine.id;
  const uuid = req.body.authentication;

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
        User.findByPk(authentication.userId).then(async (user) => {
          if (!user) {
            return res.status(400).send({
              message: "user not found with id=" + authentication.userId,
            });
          } else {
            let limit;
            if (user.typeId !== null) {
              let type;
              try {
                type = await Type.findByPk(user.typeId);
              } catch (error) {
                return res.status(500).send({
                  message:
                    "there occured an error when getting the type in getting a handgel",
                });
              }
              limit = type.sanitizerLimitPerMonth;
            } else {
              limit = null;
            }

            let greatherDate = new Date();
            greatherDate.setDate(greatherDate.getDate() - 30);

            Authentication.findAll({
              where: {
                userId: user.id,
                updatedAt: {
                  [Op.gte]: greatherDate,
                },
                vendingMachineId: {
                  [Op.ne]: null,
                },
              },
            }).then((authentications) => {
              if (authentications.length >= limit && limit !== null) {
                return res.status(400).send({
                  message: "limit reached id=" + authentication.userId,
                });
              } else {
                AutherizedUserPerMachine.findOne({
                  where: {
                    userId: authentication.userId,
                    vendingMachineId: id,
                  },
                }).then((userAutherizedForVendingmachine) => {
                  if (!userAutherizedForVendingmachine) {
                    return res.status(400).send({
                      message: "Error user not autherized for vending machines",
                    });
                  } else {
                    VendingMachine.findByPk(id)
                      .then((vendingMachine) => {
                        if (!vendingMachine) {
                          return res.status(400).send({
                            message: `Cannot get vending machine with id=${id}. Maybe vending machine was not found!`,
                          });
                        } else {
                          if (vendingMachine.stock > 0) {
                            vendingMachine.stock = vendingMachine.stock - 1;
                            if (
                              vendingMachine.stock == vendingMachine.alertLimit
                            ) {
                              console.log("alert melding ");
                              vendingMachine.createAlert({
                                type: alertTypes.stock,
                                melding: "stock is running low",
                              });
                            }
                            vendingMachine
                              .save()
                              .then((updatedVendingMachine) => {
                                console.log("updatedVendingMachine");
                                console.log(updatedVendingMachine);
                                if (!updatedVendingMachine) {
                                  return res.status(400).send({
                                    message: `Cannot updated vending machine with id=${id}`,
                                  });
                                } else {
                                  authentication.vendingMachineId =
                                    updatedVendingMachine.id;
                                  authentication
                                    .save()
                                    .then((data) => {
                                      console.log("authentication");
                                      console.log(authentication);
                                      if (!data) {
                                        return res.status(400).send({
                                          message: `Cannot updated vending machine with id=${id}`,
                                        });
                                      } else {
                                        return res.send(
                                          returnVendingMachine(
                                            updatedVendingMachine
                                          )
                                        );
                                      }
                                    })
                                    .catch((err) => {
                                      return res.status(500).send({
                                        message:
                                          err ||
                                          "Error updating stock vending machines",
                                      });
                                    });
                                }
                              });
                          } else {
                            vendingMachine.createAlert({
                              type: alertTypes.stock,
                              melding: "out of stock",
                            });
                            return res.status(400).send({
                              message: `the vending machine with id=${id} is out of stock.`,
                            });
                          }
                        }
                      })
                      .catch((err) => {
                        return res.status(500).send({
                          message:
                            err.message ||
                            "Error updating stock vending machines",
                        });
                      });
                  }
                });
              }
            });
          }
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

exports.handgelbijvullen = async (req, res) => {
  const id = req.params.id;
  VendingMachine.findByPk(id)
    .then((vendingMachine) => {
      if (!vendingMachine) {
        return res.status(400).send({
          message: `Cannot get vending machine with id=${id}. Maybe vending machine was not found!`,
        });
      } else {
        if (
          !authJwt.checkIfPermission(req, permission.VENDING_MACHINE_UPDATE)
          // ) ||
          // authJwt.checkIfPermission(
          //   req,
          //   permission.VENDING_MACHINE_UPDATE_COMPANY
          // )
        ) {
          if (req.authUser.companyId != vendingMachine.companyId) {
            return res.status(400).send({
              message: `unautherized you cannot updated this vending machine!`,
            });
          }
        }

        console.log("bijvullen");
        vendingMachine.stock = vendingMachine.maxNumberOfProducts;
        vendingMachine
          .save()
          .then((updatedVendingMachine) => {
            console.log("saved");
            if (!updatedVendingMachine) {
              return res.status(400).send({
                message: `Cannot updated vending machine with id=${id}`,
              });
            } else {
              updatedVendingMachine
                .createAlert({
                  type: alertTypes.stock,
                  melding: "stock is refild",
                })
                .then((alertCreated) => {
                  console.log("allert");
                  return res.send(returnVendingMachine(updatedVendingMachine));
                });
            }
          })
          .catch((err) => {
            return res.status(500).send({
              message: err || "Error updating stock vending machines",
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error updating stock vending machines",
      });
    });
};

exports.findAll = (req, res) => {
  if (!authJwt.checkIfPermission(req, permission.VENDING_MACHINE_READ)) {
    VendingMachine.findAll({
      where: {
        companyId: req.authUser.companyId,
      },
    })
      .then((vendingMachines) => {
        if (!vendingMachines)
          return res.status(400).send({ message: "No vending machines found" });
        return res.send(returnVendingMachines(vendingMachines));
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Error retrieving vending machines",
        });
      });
  }
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

exports.delete = async (req, res) => {
  const id = req.params.id;
  if (!authJwt.checkIfPermission(req, permission.VENDING_MACHINE_READ)) {
    let vendingmachine;
    try {
      vendingmachine = await VendingMachine.findByPk(id);
    } catch (err) {
      return res.status(500).send({
        message:
          err.message || "Error retrieving vendingmachine with id: " + id,
      });
    }
    if (!vendingmachine) {
      return res.status(400).send({
        message: `can not find vendingmachine`,
      });
    } else {
      if (vendingmachine.companyId != req.authUser.companyId) {
        return res.status(401).send({
          message: `unautherized to update the vending machine with id:${id}`,
        });
      }
    }
  }

  UserThatReceiveAlertsFromVendingMachine.findAll({
    where: {
      vendingMachineId: id,
    },
  })
    .then((userThatReceiveAlertsFromVendingMachines) => {
      for (
        let i = 0;
        i < userThatReceiveAlertsFromVendingMachines.length;
        i++
      ) {
        userThatReceiveAlertsFromVendingMachines[i].destroy();
      }
      Alert.findAll({
        where: {
          vendingMachineId: id,
        },
      })
        .then((alerts) => {
          for (let i = 0; i < alerts.length; i++) {
            alerts[i].destroy();
          }
          AutherizedUserPerMachine.findAll({
            where: {
              vendingMachineId: id,
            },
          })
            .then((autherizedUserPerMachines) => {
              for (let i = 0; i < autherizedUserPerMachines.length; i++) {
                autherizedUserPerMachines[i].destroy();
              }
              Authentication.findAll({
                where: {
                  vendingMachineId: id,
                },
              })
                .then((authentications) => {
                  for (let i = 0; i < authentications.length; i++) {
                    authentications[i].destroy();
                  }
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
                              message:
                                "vending machine was deleted successfully!",
                            });
                          })
                          .catch((err) => {
                            return res.status(500).send({
                              message:
                                err.message ||
                                "Could not delete vending machine with id=" +
                                  id,
                            });
                          });
                      }
                    })
                    .catch((err) => {
                      return res.status(500).send({
                        message:
                          err.message ||
                          "Could not vending machine user with id=" + id,
                      });
                    });
                })
                .catch((err) => {
                  return res.status(500).send({
                    message:
                      err.message ||
                      "Could not delete authentications from vending machine user with id=" +
                        id,
                  });
                });
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Could not delete AutherizedUserPerMachine from vending machine user with id=" +
                    id,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message ||
              "Could not delete alerts from vending machine user with id=" + id,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Could not delete UserThatReceiveAlertsFromVendingMachine from vending machine user with id=" +
            id,
      });
    });
};
exports.deleteLocal = (req, res, id) => {
  UserThatReceiveAlertsFromVendingMachine.findAll({
    where: {
      vendingMachineId: id,
    },
  })
    .then((userThatReceiveAlertsFromVendingMachines) => {
      for (
        let i = 0;
        i < userThatReceiveAlertsFromVendingMachines.length;
        i++
      ) {
        userThatReceiveAlertsFromVendingMachines[i].destroy();
      }
      Alert.findAll({
        where: {
          vendingMachineId: id,
        },
      })
        .then((alerts) => {
          for (let i = 0; i < alerts.length; i++) {
            alerts[i].destroy();
          }
          AutherizedUserPerMachine.findAll({
            where: {
              vendingMachineId: id,
            },
          })
            .then((autherizedUserPerMachines) => {
              for (let i = 0; i < autherizedUserPerMachines.length; i++) {
                autherizedUserPerMachines[i].destroy();
              }
              Authentication.findAll({
                where: {
                  vendingMachineId: id,
                },
              })
                .then((authentications) => {
                  for (let i = 0; i < authentications.length; i++) {
                    authentications[i].destroy();
                  }
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
                            return;
                          })
                          .catch((err) => {
                            return res.status(500).send({
                              message:
                                err.message ||
                                "Could not delete vending machine with id=" +
                                  id,
                            });
                          });
                      }
                    })
                    .catch((err) => {
                      return res.status(500).send({
                        message:
                          err.message ||
                          "Could not vending machine user with id=" + id,
                      });
                    });
                })
                .catch((err) => {
                  return res.status(500).send({
                    message:
                      err.message ||
                      "Could not delete authentications from vending machine user with id=" +
                        id,
                  });
                });
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Could not delete AutherizedUserPerMachine from vending machine user with id=" +
                    id,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message ||
              "Could not delete alerts from vending machine user with id=" + id,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Could not delete UserThatReceiveAlertsFromVendingMachine from vending machine user with id=" +
            id,
      });
    });
};
