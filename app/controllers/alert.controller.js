const db = require("./../models/index");
const Alert = db.alert;
const alertTypes = require("./../const/alertTypes");
const UserThatReceiveAlertsFromVendingMachine =
  db.userThatReceiveAlertsFromVendingMachine;

returnAlert = (data) => {
  return {
    result: {
      id: data.id,
      type: data.type,
      melding: data.melding,
      vendingMachineId: data.vendingMachineId,
    },
  };
};

returnAlerts = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      type: data.type,
      melding: data.melding,
      vendingMachineId: data.vendingMachineId,
    })),
  };
};

// Create and Save a new user
exports.machineMishandeld = (req, res) => {
  console.log("create function alert");
  const id = req.params.id;

  let alert = new Alert({
    type: alertTypes.machineAbuse,
    melding: "de machine wordt misbruikt",
    vendingMachineId: id,
  });
  console.log(alert);
  alert
    .save()
    .then((data) => {
      return res.send(returnAlert(data));
    })
    .catch(() => {
      return res.status(500).send({
        message: "Error creating alert ",
      });
    });
};

// Find a single user with an id
exports.getAllAlertsFromUser = (req, res) => {
  const id = req.authUser.id;

  UserThatReceiveAlertsFromVendingMachine.findAll({
    where: {
      userId: id,
    },
    attributes: ["vendingMachineId"],
  })
    .then((vendingmachineAccess) => {
      if (!vendingmachineAccess)
        return res.status(400).send({
          message: "Not found userAccesOnVendingMachines with id " + id,
        });
      else {
        console.log(vendingmachineAccess);
        let vendingmachineAccessArray = [];
        for (let i = 0; i < vendingmachineAccess.length; i++) {
          console.log(vendingmachineAccess[i]);
          console.log(vendingmachineAccess[i].vendingMachineId);
          vendingmachineAccessArray.push(
            vendingmachineAccess[i].vendingMachineId
          );
        }
        Alert.findAll({
          where: {
            vendingMachineId: vendingmachineAccessArray,
          },
        })
          .then((alert) => {
            console.log(alert);
            if (!alert)
              return res.status(400).send({ message: "No alerts found" });
            return res.send(returnAlerts(alert));
          })
          .catch((err) => {
            return res
              .status(500)
              .send({ message: err.message || "Error retrieving alerts" });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Error retrieving userAccesOnVendingMachines with id=" +
          id +
          " error : " +
          err,
      });
    });
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Alert.findByPk(id)
    .then((data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found alert with id " + id });
      else {
        console.log(data);
        return res.send(returnAlert(data));
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving alert string with id=" + id,
      });
    });
};

// Find all users
exports.findAll = (req, res) => {
  Alert.findAll()
    .then((alert) => {
      if (!alert) return res.status(400).send({ message: "No alert found" });
      return res.send(returnAlerts(alert));
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: err.message || "Error retrieving alert" });
    });
};
// Update a user
// exports.update = async (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({ message: "geen data?" });
//   }
//   const id = req.params.id;
//   Alert.findByPk(id).then((alert) => {
//     if (!authentication) {
//       return res.status(400).send({
//         message: `Cannot get alert with id=${id}. Maybe alert string was not found!`,
//       });
//     } else {
//       alert.update(req.body).then((updatedAlert) => {
//         if (!updatedAlert) {
//           return res.status(400).send({
//             message: `Cannot updated alert with id=${id}`,
//           });
//         } else {
//           return res.send(returnAlert(updatedAlert));
//         }
//       });
//     }
//   });
// };
// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Alert.findByPk(id)
    .then((alert) => {
      if (!alert) {
        return res.status(400).send({
          message: `Cannot delete alert with id=${id}. Maybe alert was not found!`,
        });
      } else {
        alert
          .destroy()
          .then(() => {
            return res.send({
              message: "alert was deleted successfully!",
            });
          })
          .catch((err) => {
            return res.status(500).send({
              message: err.message || "Could not delete alert with id=" + id,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Could not find alert with id=" + id,
      });
    });
};
