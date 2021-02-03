const db = require("./../models/index");
const { v4: uuidv4 } = require("uuid");
const Authentication = db.authentication;
const permission = require("../const/permissions");
const { authJwt } = require("../middlewares/index");
const User = db.user;
const VendingMachine = db.vendingMachine;
const { Op } = require("sequelize");

//helper function to store Authentication in db
storeAuthenticationDatabase = (authentication, res) => {
  authentication
    .save(authentication)
    .then((data) => {
      return res.send(returnAuthentication(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the vending machine.",
      });
    });
};
returnAuthentication = (data) => {
  return {
    result: {
      id: data.id,
      authentication: data.authentication,
      userId: data.userId,
      vendingMachineId: data.vendingMachineId,
    },
  };
};

returnAuthentications = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      authentication: data.authentication,
      userId: data.userId,
      vendingMachineId: data.vendingMachineId,
    })),
  };
};

// Create and Save a new Authentication
exports.create = (req, res) => {
  console.log("create function");
  Authentication.findOne({
    where: {
      userId: req.authUser.id,
      vendingMachineId: null,
    },
  }).then((authenticationFound) => {
    if (!authenticationFound) {
      let authenticationString = uuidv4();
      let authentication = new Authentication({
        userId: req.authUser.id,
        authentication: authenticationString,
      });
      console.log(authentication);
      authentication
        .save()
        .then((data) => {
          return res.send(returnAuthentication(data));
        })
        .catch(() => {
          return res.status(500).send({
            message: "Error creating authentication string ",
          });
        });
    } else {
      return res.send(returnAuthentication(authenticationFound));
    }
  });
};

exports.createQrCodeForUser = (req, res) => {
  console.log("create function");
  console.log(req.body.userId);
  if (!req.body.userId || isNaN(req.body.userId)) {
    return res.status(400).send({
      message: "userId can't be null",
    });
  }
  User.findByPk(req.body.userId).then((user) => {
    if (
      !authJwt.cehckIfPermission(req, permission.AUTHENTICATION_CREATE)
    ) {
      if (req.authUser.companyId != user.companyId) {
        return res.status(400).send({
          message:
            "User with id: " +
            user.id +
            " can't be updated because the user can not update the users from another company",
        });
      }
    }
    Authentication.findOne({
      where: {
        userId: req.body.userId,
        vendingMachineId: null,
      },
    }).then((authenticationFound) => {
      if (!authenticationFound) {
        let authenticationString = uuidv4();
        let authentication = new Authentication({
          userId: req.body.userId,
          authentication: authenticationString,
        });
        console.log(authentication);
        authentication
          .save(authentication)
          .then((data) => {
            console.log(data);
            return res.send(returnAuthentication(data));
          })
          .catch(() => {
            return res.status(500).send({
              message: "Error creating authentication string ",
            });
          });
      } else {
        return res.send(returnAuthentication(authenticationFound));
      }
    });
  });
};
// Find a single user with user id
exports.findByUserID = async (req, res) => {
  const id = req.params.id;

  Authentication.findOne({
    where: {
      userId: id,
      vendingMachineId: null,
    },
  })
    .then(async (data) => {
      if (!data)
        return res.status(400).send({
          message: "there is no authentication string for this user " + id,
        });
      else {
        if (
          !authJwt.cehckIfPermission(req, permission.AUTHENTICATION_READ)
        ) {
          let user;
          try {
            user = await User.findByPk(data.userId);
          } catch (err) {
            return res.status(500).send({ message: "Error retrieving user  " });
          }
          if (user.companyId == req.authUser.companyId) {
            return res.send(returnAuthentication(data));
          } else {
            return res.status(400).send({
              message:
                "you cannot read this authentication becaus it is from another company",
            });
          }
        } else {
          console.log(data);
          return res.send(returnAuthentication(data));
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving authentication string with id=" + id,
      });
    });
};
// Find a single Authentication with an id
exports.findOne = async (req, res) => {
  console.log("findone");
  const id = req.params.id;

  Authentication.findByPk(id)
    .then(async (data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found authentication with id " + id });
      else {
        if (
          !authJwt.cehckIfPermission(req, permission.AUTHENTICATION_READ)
        ) {
          console.log("vendingmachines");
          console.log(data.vendingMachineId);
          let vendingmachines = null;
          if (data.vendingMachineId != null) {
            try {
              vendingmachines = await VendingMachine.findByPk(
                data.vendingMachineId
              );
            } catch (err) {
              return res
                .status(500)
                .send({ message: "Error retrieving vendingmachine " });
            }
            console.log("vendingmachines2");
          }
          let user;
          try {
            user = await User.findByPk(data.userId);
          } catch (err) {
            return res
              .status(500)
              .send({ message: "Error retrieving vendingmachine " });
          }
          if (
            user.companyId == req.authUser.companyId ||
            (vendingmachines &&
              vendingmachines.companyId == req.authUser.companyId)
          ) {
            console.log("vendingmachines3");
            console.log(data);
            return res.send(returnAuthentication(data));
          } else {
            return res.status(400).send({
              message:
                "you cannot read this authentication becaus it is from another company",
            });
          }
        } else {
          console.log(data);
          return res.send(returnAuthentication(data));
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving authentication string with id=" + id,
      });
    });
};
// Find a single Authentication with an authentication string (uuid)
exports.findByAuthenticationString = (req, res) => {
  const uuid = req.params.uuid;

  Authentication.findOne({
    where: {
      authentication: uuid,
    },
  })
    .then(async (data) => {
      if (!data)
        return res.status(400).send({
          message:
            "Not found authentication with authentication string " + uuid,
        });
      else {
        if (
          !authJwt.cehckIfPermission(req, permission.AUTHENTICATION_READ)
        ) {
          console.log("vendingmachines");
          console.log(data.vendingMachineId);
          let vendingmachines = null;
          if (data.vendingMachineId != null) {
            try {
              vendingmachines = await VendingMachine.findByPk(
                data.vendingMachineId
              );
            } catch (err) {
              return res
                .status(500)
                .send({ message: "Error retrieving vendingmachine" });
            }
            console.log("vendingmachines2");
          }
          let user;
          try {
            user = await User.findByPk(data.userId);
          } catch (err) {
            return res.status(500).send({
              message: "Error retrieving user with id: " + data.userId,
            });
          }
          if (
            user.companyId == req.authUser.companyId ||
            (vendingmachines &&
              vendingmachines.companyId == req.authUser.companyId)
          ) {
            console.log("vendingmachines3");
            console.log(data);
            return res.send(returnAuthentication(data));
          } else {
            return res.status(400).send({
              message:
                "you cannot read this authentication becaus it is from another company",
            });
          }
        } else {
          console.log(data);
          return res.send(returnAuthentication(data));
        }
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

// Update a Authentication
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  const id = req.params.id;
  Authentication.findByPk(id).then((authentication) => {
    if (!authentication) {
      return res.status(400).send({
        message: `Cannot get authentication with id=${id}. Maybe authentication string was not found!`,
      });
    } else {
      VendingMachine.findByPk(req.body.vendingMachineId).then(
        (vendingmachine) => {
          if (!vendingmachine) {
            return res.status(400).send({
              message: `Cannot get vendingmachine with id=${id}. Maybe vendingmachine string was not found when updating authentication!`,
            });
          } else {
            User.findByPk(authentication.userId).then((user) => {
              if (!user) {
                return res.status(400).send({
                  message: `Cannot get user with id=${id}. Maybe user was not found when updating authentication!`,
                });
              } else {
                if (
                  !authJwt.cehckIfPermission(
                    req,
                    permission.AUTHENTICATION_UPDATE
                  )
                ) {
                  console.log(req.authUser.companyId);
                  console.log(user);
                  if (req.authUser.companyId != user.companyId) {
                    return res.status(400).send({
                      message: `not autherized to update this authetntication because the user is from another company`,
                    });
                  }
                }
                authentication.vendingMachineId = req.body.vendingMachineId;
                authentication.save().then((updatedAuthentication) => {
                  if (!updatedAuthentication) {
                    return res.status(400).send({
                      message: `Cannot updated vending machine with id=${id}`,
                    });
                  } else {
                    return res.send(
                      returnAuthentication(updatedAuthentication)
                    );
                  }
                });
              }
            });
          }
        }
      );
    }
  });
};

// Find all Authentications
exports.findAll = async (req, res) => {
  if (!authJwt.cehckIfPermission(req, permission.AUTHENTICATION_READ)) {
    let vendingmachines;
    try {
      vendingmachines = await VendingMachine.findAll({
        where: { companyId: req.authUser.companyId },
      });
    } catch (err) {
      return res.status(500).send({
        message: "Error retrieving vendingmachines ",
      });
    }
    let vendingmachinesIds = [];
    for (let i = 0; i < vendingmachines.length; i++) {
      vendingmachinesIds.push(vendingmachines[i].id);
    }
    let users;
    try {
      users = await User.findAll({
        where: { companyId: req.authUser.companyId },
      });
    } catch (err) {
      return res.status(500).send({ message: "Error retrieving users " });
    }
    let usersIds = [];
    for (let i = 0; i < users.length; i++) {
      usersIds.push(users[i].id);
    }
    console.log(usersIds);
    Authentication.findAll({
      where: {
        [Op.or]: [
          {
            vendingMachineId: vendingmachinesIds,
          },
          { userId: usersIds },
        ],
      },
    })
      .then((authentication) => {
        if (!authentication)
          return res.status(400).send({ message: "No authentication found" });
        return res.send(returnAuthentications(authentication));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving authentication" });
      });
  } else {
    Authentication.findAll()
      .then((authentication) => {
        if (!authentication)
          return res.status(400).send({ message: "No authentication found" });
        return res.send(returnAuthentications(authentication));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving authentication" });
      });
  }
};

// Delete a Authentication with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Authentication.findByPk(id)
    .then((authentication) => {
      if (!authentication) {
        return res.status(400).send({
          message: `Cannot delete authentication with id=${id}. Maybe authentication was not found!`,
        });
      } else {
        if (
          !authJwt.cehckIfPermission(
            req,
            permission.AUTHENTICATION_UPDATE
          )
        ) {
          User.findByPk(authentication.userId).then((user) => {
            if (!user) {
              return res.status(400).send({
                message: `Cannot get user with id=${id}. Maybe user was not found when updating authentication!`,
              });
            } else {
              if (req.authUser.companyId != user.companyId) {
                return res.status(400).send({
                  message: `not autherized to update this authetntication because the user is from another company`,
                });
              } else {
                authentication
                  .destroy()
                  .then(() => {
                    return res.send({
                      message: "authentication was deleted successfully!",
                    });
                  })
                  .catch((err) => {
                    return res.status(500).send({
                      message:
                        err.message ||
                        "Could not delete vauthentication with id=" + id,
                    });
                  });
              }
            }
          });
        } else {
          authentication
            .destroy()
            .then(() => {
              return res.send({
                message: "authentication was deleted successfully!",
              });
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Could not delete vauthentication with id=" + id,
              });
            });
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Could not find authentication with id=" + id,
      });
    });
};
