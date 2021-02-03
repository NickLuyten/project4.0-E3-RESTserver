const db = require("./../models/index");
const AutherizedUserPerMachine = db.autherizedUserPerMachine;
const User = db.user;
const VendingMachine = db.vendingMachine;
const { authJwt } = require("../middlewares/index");
const permission = require("../const/permissions");
const { Op } = require("sequelize");

//helper function to store AutherizedUserPerMachine in db
storeAutherizedUserPerMachine = (autherizedUserPerMachine, res) => {
  autherizedUserPerMachine
    .save(autherizedUserPerMachine)
    .then((data) => {
      return res.send(returnAutherizedUserPerMachine(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the autherizedUserPerMachine.",
      });
    });
};
returnAutherizedUserPerMachine = (data) => {
  return {
    result: {
      id: data.id,
      userId: data.userId,
      vendingMachineId: data.vendingMachineId,
    },
  };
};

returnAutherizedUserPerMachines = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      userId: data.userId,
      vendingMachineId: data.vendingMachineId,
    })),
  };
};

// Create and Save a new AutherizedUserPerMachine
exports.create = (req, res) => {
  User.findByPk(req.body.userId)
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: "User not found for create autherizedUserPermachine ",
        });
      } else {
        VendingMachine.findByPk(req.body.vendingMachineId)
          .then((vendingMachine) => {
            if (!vendingMachine) {
              return res.status(400).send({
                message:
                  "vendingmachine not found for create autherizedUserPermachine ",
              });
            } else {
              if (
                !authJwt.cehckIfPermission(
                  req,
                  permission.AUTHERIZED_USER_PER_MACHINE_CREATE
                )
              ) {
                if (
                  !(
                    user.companyId == req.authUser.companyId &&
                    vendingMachine.companyId == req.authUser.companyId
                  )
                ) {
                  return res.status(400).send({
                    message:
                      "not autherzied to create autherizedUserPerMachine ",
                  });
                }
              }
              console.log("create function autherizedUserPerMachine");
              let autherizedUserPerMachine = new AutherizedUserPerMachine({
                userId: req.body.userId,
                vendingMachineId: req.body.vendingMachineId,
              });
              console.log(autherizedUserPerMachine);
              autherizedUserPerMachine
                .save()
                .then((data) => {
                  return res.send(returnAutherizedUserPerMachine(data));
                })
                .catch((err) => {
                  return res.status(500).send({
                    message:
                      "Error creating AutherizedUserPerMachine error :  " + err,
                  });
                });
            }
          })
          .catch((err) => {
            return res.status(500).send({
              message:
                "Error creating AutherizedUserPerMachine error :  " + err,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error creating AutherizedUserPerMachine error :  " + err,
      });
    });
};

// Find a single AutherizedUserPerMachine with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AutherizedUserPerMachine.findByPk(id)
    .then((data) => {
      if (!data)
        return res.status(400).send({
          message: "Not found AutherizedUserPerMachine with id " + id,
        });
      else {
        VendingMachine.findByPk(data.vendingMachineId).then(
          (vendingmachine) => {
            if (!vendingmachine) {
              return res.status(400).send({
                message:
                  "the machine for AutherizedUserPerMachine  with id " +
                  id +
                  " was not found",
              });
            } else {
              console.log("test");
              if (
                !authJwt.cehckIfPermission(
                  req,
                  permission.AUTHERIZED_USER_PER_MACHINE_READ
                )
              ) {
                if (vendingmachine.companyId != req.authUser.companyId) {
                  return res.status(400).send({
                    message:
                      "Not autherized to see AutherizedUserPerMachine with id " +
                      id +
                      " because it is from another vending machine that doesn't belong to your company",
                  });
                }
              }
              console.log(data);
              return res.send(returnAutherizedUserPerMachine(data));
            }
          }
        );
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Error retrieving AutherizedUserPerMachine string with id=" + id,
      });
    });
};
// Find all AutherizedUserPerMachine
exports.findAll = async (req, res) => {
  if (
    !authJwt.cehckIfPermission(req, permission.AUTHERIZED_USER_PER_MACHINE_READ)
  ) {
    let vendingmachines;
    try {
      vendingmachines = await VendingMachine.findAll({
        where: { companyId: req.authUser.companyId },
      });
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Error retrieving vendingmachines" });
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
      return res.status(500).send({ message: "Error retrieving users" });
    }
    let usersIds = [];
    for (let i = 0; i < users.length; i++) {
      usersIds.push(users[i].id);
    }
    console.log(usersIds);
    AutherizedUserPerMachine.findAll({
      where: {
        [Op.or]: [
          {
            vendingMachineId: vendingmachinesIds,
          },
          { userId: usersIds },
        ],
      },
    })
      .then((autherizedUserPerMachine) => {
        if (!autherizedUserPerMachine)
          return res
            .status(400)
            .send({ message: "No AutherizedUserPerMachine found" });
        return res.send(
          returnAutherizedUserPerMachines(autherizedUserPerMachine)
        );
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Error retrieving AutherizedUserPerMachine",
        });
      });
  } else {
    AutherizedUserPerMachine.findAll()
      .then((autherizedUserPerMachine) => {
        if (!autherizedUserPerMachine)
          return res
            .status(400)
            .send({ message: "No AutherizedUserPerMachine found" });
        return res.send(
          returnAutherizedUserPerMachines(autherizedUserPerMachine)
        );
      })
      .catch((err) => {
        return res.status(500).send({
          message: err.message || "Error retrieving AutherizedUserPerMachine",
        });
      });
  }
};

// Find all AutherizedUserPerMachine for a specific vendingmachine
exports.findAllAuthenticatedUsersForVendingMachine = (req, res) => {
  const id = req.params.id;
  VendingMachine.findByPk(id).then((vendingMachine) => {
    if (!vendingMachine) {
      return res.status(400).send({
        message: "vendingmachine for AutherizedUserPerMachine not found",
      });
    } else {
      if (
        !authJwt.cehckIfPermission(
          req,
          permission.AUTHERIZED_USER_PER_MACHINE_READ
        )
      ) {
        if (vendingMachine.companyId != req.authUser.companyId) {
          return res.status(400).send({
            message:
              "not autherized to get AutherizedUserPerMachine for this vendingmachine because this vendingmachine is from another company",
          });
        }
      }
      AutherizedUserPerMachine.findAll({
        where: {
          vendingMachineId: id,
        },
      })
        .then((autherizedUserPerMachine) => {
          if (!autherizedUserPerMachine)
            return res
              .status(400)
              .send({ message: "No AutherizedUserPerMachine found" });
          return res.send(
            returnAutherizedUserPerMachines(autherizedUserPerMachine)
          );
        })
        .catch((err) => {
          return res.status(500).send({
            message: err.message || "Error retrieving AutherizedUserPerMachine",
          });
        });
    }
  });
};

// Delete a AutherizedUserPerMachine with the vendingmachineId and the userId in the request
exports.deleteWithVendingMachineAndUser = (req, res) => {
  const vendingmachineId = req.params.vendingMachineId;
  const userId = req.params.userId;

  AutherizedUserPerMachine.findOne({
    where: {
      userId: userId,
      vendingMachineId: vendingmachineId,
    },
  })
    .then((autherizedUserPerMachine) => {
      if (!autherizedUserPerMachine) {
        return res.status(400).send({
          message: `Cannot delete autherizedUserPerMachine with vendingmachine id=${vendingmachineId} and userId=${userId}. Maybe autherizedUserPerMachine was not found!`,
        });
      } else {
        const id = autherizedUserPerMachine.id;
        if (
          !authJwt.cehckIfPermission(
            req,
            permission.AUTHERIZED_USER_PER_MACHINE_DELETE
          )
        ) {
          VendingMachine.findByPk(
            autherizedUserPerMachine.vendingMachineId
          ).then((vendingmachine) => {
            if (!vendingmachine) {
              return res.status(400).send({
                message: `Cannot delete autherizedUserPerMachine with id=${id}. because vendingmachine was not found!`,
              });
            } else {
              if (vendingmachine.companyId != req.authUser.companyId) {
                return res.status(400).send({
                  message: `Cannot delete autherizedUserPerMachine with id=${id}. because vendingmachine doesn't belong to your company!`,
                });
              } else {
                autherizedUserPerMachine
                  .destroy()
                  .then(() => {
                    return res.send({
                      message:
                        "autherizedUserPerMachine was deleted successfully!",
                    });
                  })
                  .catch((err) => {
                    return res.status(500).send({
                      message:
                        err.message ||
                        "Could not delete autherizedUserPerMachine with id=" +
                          id,
                    });
                  });
              }
            }
          });
        } else {
          autherizedUserPerMachine
            .destroy()
            .then(() => {
              return res.send({
                message: "autherizedUserPerMachine was deleted successfully!",
              });
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Could not delete autherizedUserPerMachine with id=" + id,
              });
            });
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Could not find autherizedUserPerMachine with id=" + id,
      });
    });
};

// Delete a AutherizedUserPerMachine with id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AutherizedUserPerMachine.findByPk(id)
    .then((autherizedUserPerMachine) => {
      if (!autherizedUserPerMachine) {
        return res.status(400).send({
          message: `Cannot delete autherizedUserPerMachine with id=${id}. Maybe autherizedUserPerMachine was not found!`,
        });
      } else {
        if (
          !authJwt.cehckIfPermission(
            req,
            permission.AUTHERIZED_USER_PER_MACHINE_DELETE
          )
        ) {
          VendingMachine.findByPk(
            autherizedUserPerMachine.vendingMachineId
          ).then((vendingmachine) => {
            if (!vendingmachine) {
              return res.status(400).send({
                message: `Cannot delete autherizedUserPerMachine with id=${id}. because vendingmachine was not found!`,
              });
            } else {
              if (vendingmachine.companyId != req.authUser.companyId) {
                return res.status(400).send({
                  message: `Cannot delete autherizedUserPerMachine with id=${id}. because vendingmachine doesn't belong to your company!`,
                });
              } else {
                autherizedUserPerMachine
                  .destroy()
                  .then(() => {
                    return res.send({
                      message:
                        "autherizedUserPerMachine was deleted successfully!",
                    });
                  })
                  .catch((err) => {
                    return res.status(500).send({
                      message:
                        err.message ||
                        "Could not delete autherizedUserPerMachine with id=" +
                          id,
                    });
                  });
              }
            }
          });
        } else {
          autherizedUserPerMachine
            .destroy()
            .then(() => {
              return res.send({
                message: "autherizedUserPerMachine was deleted successfully!",
              });
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Could not delete autherizedUserPerMachine with id=" + id,
              });
            });
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Could not find autherizedUserPerMachine with id=" + id,
      });
    });
};
