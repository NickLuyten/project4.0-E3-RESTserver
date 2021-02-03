const db = require("../models/index");
const UserThatReceiveAlertsFromVendingMachine =
  db.userThatReceiveAlertsFromVendingMachine;
const User = db.user;
const VendingMachine = db.vendingMachine;
const { authJwt } = require("../middlewares/index");
const permission = require("../const/permissions");
const { Op } = require("sequelize");

//helper function to store UserThatReceiveAlertsFromVendingMachine in db
storeUserThatReceiveAlertsFromVendingMachineDatabase = (
  userThatReceiveAlertsFromVendingMachine,
  res
) => {
  userThatReceiveAlertsFromVendingMachine
    .save(userThatReceiveAlertsFromVendingMachine)
    .then((data) => {
      return res.send(returnUserThatReceiveAlertsFromVendingMachine(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the UserThatReceiveAlertsFromVendingMachine relation.",
      });
    });
};
returnUserThatReceiveAlertsFromVendingMachine = (data) => {
  return {
    result: {
      id: data.id,
      userId: data.userId,
      vendingMachineId: data.vendingMachineId,
    },
  };
};

returnUserThatReceiveAlertsFromVendingMachines = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      user: returnUser(data.user),
      vendingMachine: returnVendingMachine(data.vendingMachine),
    })),
  };
};

returnUser = (data) => {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
  };
};

returnVendingMachine = (data) => {
  return {
    id: data.id,
    name: data.name,
    location: data.location,
  };
};

exports.create = async (req, res) => {
  console.log("create function");
  let user;
  try {
    user = await User.findByPk(req.body.userId);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error retrieving user with id: " + req.body.userId });
  }
  if (!user) {
    return res.status(400).send({
      message: "user doesn't exist",
    });
  }
  let vendingmachine;
  try {
    vendingmachine = await VendingMachine.findByPk(req.body.vendingMachineId);
  } catch (err) {
    return res.status(500).send({
      message:
        "Error retrieving VendingMachine with id: " + req.body.vendingMachineId,
    });
  }
  if (!vendingmachine) {
    return res.status(400).send({
      message: "vendingmachine doesn't exist",
    });
  }
  if (
    !authJwt.cehckIfPermission(
      req,
      permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE
    )
  ) {
    if (
      user.companyId != req.authUser.companyId ||
      vendingmachine.companyId != req.authUser.companyId
    ) {
      return res.status(400).send({
        message:
          "unautherized you can only create UserThatReceiveAlertsFromVendingMachine for users and vendingmachines of your company",
      });
    }
  }
  UserThatReceiveAlertsFromVendingMachine.findOne({
    where: {
      userId: req.body.userId,
      vendingMachineId: req.body.vendingMachineId,
    },
  }).then((authenticationFound) => {
    if (!authenticationFound) {
      let userThatReceiveAlertsFromVendingMachine = new UserThatReceiveAlertsFromVendingMachine(
        {
          userId: req.authUser.id,
          vendingMachineId: req.body.vendingMachineId,
        }
      );
      console.log(userThatReceiveAlertsFromVendingMachine);
      userThatReceiveAlertsFromVendingMachine
        .save()
        .then((data) => {
          return res.send(returnUserThatReceiveAlertsFromVendingMachine(data));
        })
        .catch(() => {
          return res.status(500).send({
            message:
              "Error creating UserThatReceiveAlertsFromVendingMachine relation ",
          });
        });
    } else {
      return res.status(400).send({
        message:
          "Error UserThatReceiveAlertsFromVendingMachine already exists " + id,
      });
    }
  });
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  UserThatReceiveAlertsFromVendingMachine.findByPk(id)
    .then(async (data) => {
      if (!data)
        return res.status(400).send({
          message:
            "Not found UserThatReceiveAlertsFromVendingMachine with id " + id,
        });
      else {
        if (
          !authJwt.cehckIfPermission(
            req,
            permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_READ
          )
        ) {
          let vendingmachine;
          try {
            vendingmachine = await VendingMachine.findByPk(
              data.vendingMachineId
            );
          } catch (err) {
            return res.status(500).send({
              message:
                "Error retrieving VendingMachine with id: " +
                data.vendingMachineId,
            });
          }
          if (!vendingmachine) {
            return res.status(400).send({
              message:
                "vending machine not found for UserThatReceiveAlertsFromVendingMachine with id " +
                id,
            });
          } else {
            if (vendingmachine.companyId != req.authUser.companyId) {
              return res.status(400).send({
                message:
                  "unautherized vending machine is from another company ",
              });
            }
          }
        }
        console.log(data);
        return res.send(returnUserThatReceiveAlertsFromVendingMachine(data));
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Error retrieving UserThatReceiveAlertsFromVendingMachine with id=" +
          id,
      });
    });
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  const id = req.params.id;
  UserThatReceiveAlertsFromVendingMachine.findByPk(id).then(
    (userThatReceiveAlertsFromVendingMachine) => {
      if (!userThatReceiveAlertsFromVendingMachine) {
        return res.status(400).send({
          message: `Cannot get userThatReceiveAlertsFromVendingMachine with id=${id}. Maybe userThatReceiveAlertsFromVendingMachine  was not found!`,
        });
      } else {
        userThatReceiveAlertsFromVendingMachine.vendingMachineId =
          req.body.vendingMachineId;
        userThatReceiveAlertsFromVendingMachine.userId = req.body.userId;
        userThatReceiveAlertsFromVendingMachine
          .save()
          .then((updatedUserThatReceiveAlertsFromVendingMachine) => {
            if (!updatedUserThatReceiveAlertsFromVendingMachine) {
              return res.status(400).send({
                message: `Cannot updated updatedUserThatReceiveAlertsFromVendingMachine with id=${id}`,
              });
            } else {
              return res.send(
                returnUserThatReceiveAlertsFromVendingMachine(
                  updatedUserThatReceiveAlertsFromVendingMachine
                )
              );
            }
          });
      }
    }
  );
};

exports.findAll = async (req, res) => {
  if (
    !authJwt.cehckIfPermission(
      req,
      permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_CREATE
    )
  ) {
    let vendingmachines;
    try {
      vendingmachines = await VendingMachine.findAll({
        where: { companyId: req.authUser.companyId },
      });
    } catch (err) {
      return res.status(500).send({
        message: "Error retrieving VendingMachines",
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
      return res.status(500).send({ message: "Error retrieving users" });
    }
    let usersIds = [];
    for (let i = 0; i < users.length; i++) {
      usersIds.push(users[i].id);
    }

    UserThatReceiveAlertsFromVendingMachine.findAll({
      where: {
        [Op.or]: [
          {
            vendingMachineId: vendingmachinesIds,
          },
          { userId: usersIds },
        ],
      },
      include: [
        {
          model: User,
        },
        {
          model: VendingMachine,
        },
      ],
    })
      .then((userThatReceiveAlertsFromVendingMachine) => {
        if (!userThatReceiveAlertsFromVendingMachine)
          return res.status(400).send({
            message: "No userThatReceiveAlertsFromVendingMachine found",
          });
        return res.send(
          returnUserThatReceiveAlertsFromVendingMachines(
            userThatReceiveAlertsFromVendingMachine
          )
        );
      })
      .catch((err) => {
        return res.status(500).send({
          message:
            err || "Error retrieving userThatReceiveAlertsFromVendingMachine",
        });
      });
  } else {
    UserThatReceiveAlertsFromVendingMachine.findAll({
      include: [
        {
          model: User,
        },
        {
          model: VendingMachine,
        },
      ],
    })
      .then((userThatReceiveAlertsFromVendingMachine) => {
        if (!userThatReceiveAlertsFromVendingMachine)
          return res.status(400).send({
            message: "No userThatReceiveAlertsFromVendingMachine found",
          });
        return res.send(
          returnUserThatReceiveAlertsFromVendingMachines(
            userThatReceiveAlertsFromVendingMachine
          )
        );
      })
      .catch((err) => {
        return res.status(500).send({
          message:
            err || "Error retrieving userThatReceiveAlertsFromVendingMachine",
        });
      });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  UserThatReceiveAlertsFromVendingMachine.findByPk(id)
    .then(async (userThatReceiveAlertsFromVendingMachine) => {
      if (!userThatReceiveAlertsFromVendingMachine) {
        return res.status(400).send({
          message: `Cannot delete userThatReceiveAlertsFromVendingMachine with id=${id}. Maybe userThatReceiveAlertsFromVendingMachine was not found!`,
        });
      } else {
        if (
          !authJwt.cehckIfPermission(
            req,
            permission.USER_THAT_RECEIVE_ALERTS_FROM_VENDING_MACHINE_DELETE
          )
        ) {
          let vendingMachine;
          try {
            vendingMachine = await VendingMachine.findByPk(
              userThatReceiveAlertsFromVendingMachine.vendingMachineId
            );
          } catch (err) {
            return res.status(500).send({
              message:
                err.message ||
                "Error retrieving vendingmachine with id: " +
                  id +
                  " while doing userThatReceiveAletrsFromVendingMachine",
            });
          }
          if (!vendingMachine) {
            return res.status(400).send({
              message: `Cannot find vendingMachine for userThatReceiveAlertsFromVendingMachine with id=${id}.`,
            });
          } else {
            if (vendingMachine.companyId != req.authUser.companyId) {
              return res.status(400).send({
                message: `unautherized to delete userThatReceiveAlertsFromVendingMachine with id=${id}.`,
              });
            }
          }
        }
        userThatReceiveAlertsFromVendingMachine
          .destroy()
          .then(() => {
            return res.send({
              message:
                "userThatReceiveAlertsFromVendingMachine was deleted successfully!",
            });
          })
          .catch((err) => {
            return res.status(500).send({
              message:
                err ||
                "Could not delete userThatReceiveAlertsFromVendingMachine with id=" +
                  id,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err ||
          "Could not find userThatReceiveAlertsFromVendingMachine with id=" +
            id,
      });
    });
};
