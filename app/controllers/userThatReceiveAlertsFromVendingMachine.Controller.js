const db = require("../models/index");
const UserThatReceiveAlertsFromVendingMachine =
  db.userThatReceiveAlertsFromVendingMachine;

//helper function to store user in db
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
      userId: data.userId,
      vendingMachineId: data.vendingMachineId,
    })),
  };
};

// Create and Save a new user
exports.create = (req, res) => {
  console.log("create function");
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

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  UserThatReceiveAlertsFromVendingMachine.findByPk(id)
    .then((data) => {
      if (!data)
        return res.status(400).send({
          message:
            "Not found UserThatReceiveAlertsFromVendingMachine with id " + id,
        });
      else {
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

// Update a user
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

// Find all users
exports.findAll = (req, res) => {
  UserThatReceiveAlertsFromVendingMachine.findAll()
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
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  UserThatReceiveAlertsFromVendingMachine.findByPk(id)
    .then((userThatReceiveAlertsFromVendingMachine) => {
      if (!userThatReceiveAlertsFromVendingMachine) {
        return res.status(400).send({
          message: `Cannot delete userThatReceiveAlertsFromVendingMachine with id=${id}. Maybe userThatReceiveAlertsFromVendingMachine was not found!`,
        });
      } else {
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
