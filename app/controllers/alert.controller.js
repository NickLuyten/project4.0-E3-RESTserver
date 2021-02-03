const db = require("./../models/index");
const Alert = db.alert;
const alertTypes = require("./../const/alertTypes");
const UserThatReceiveAlertsFromVendingMachine =
  db.userThatReceiveAlertsFromVendingMachine;
const permission = require("../const/permissions");
const { authJwt } = require("../middlewares/index");
const VendingMachine = db.vendingMachine;

returnAlert = (data) => {
  return {
    result: {
      id: data.id,
      type: data.type,
      melding: data.melding,
      vendingMachineId: data.vendingMachineId,
      createdAt: data.createdAt,
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
      createdAt: data.createdAt,
    })),
  };
};

exports.machineMishandeld = (req, res) => {
  console.log("create function alert");
  const id = req.authVendingMachine.id;

  VendingMachine.findByPk(id).then((vendingmachine) => {
    if (!vendingmachine) {
      return res.status(400).send({
        message:
          "vending machine with id: " +
          id +
          " was not found for creating alert",
      });
    } else {
      console.log("create alert");
      let alert = new Alert({
        type: alertTypes.machineAbuse,
        melding: "de machine wordt misbruikt",
        vendingMachineId: id,
      });
      console.log(alert);
      alert
        .save(alert)
        .then((data) => {
          console.log("saved");

          return res.send(returnAlert(data));
        })
        .catch(() => {
          return res.status(500).send({
            message: "Error creating alert ",
          });
        });
    }
  });
};

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

exports.findOne = (req, res) => {
  const id = req.params.id;

  Alert.findByPk(id)
    .then((data) => {
      if (!data) {
        return res
          .status(400)
          .send({ message: "Not found alert with id " + id });
      } else {
        if (!authJwt.cehckIfPermission(req, permission.ALERT_READ)) {
          VendingMachine.findByPk(data.vendingMachineId).then(
            (vendingmachine) => {
              if (vendingmachine.companyId == req.authUser.companyId) {
                return res.send(returnAlert(data));
              } else {
                return res.status(400).send({
                  message: "you cannot see the alerts from other companies",
                });
              }
            }
          );
        } else {
          console.log(data);
          return res.send(returnAlert(data));
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving alert string with id=" + id,
      });
    });
};

exports.findAll = async (req, res) => {
  if (!authJwt.cehckIfPermission(req, permission.ALERT_READ)) {
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
    Alert.findAll({
      where: {
        vendingmachineId: vendingmachinesIds,
      },
    })
      .then((alert) => {
        if (!alert) return res.status(400).send({ message: "No alert found" });
        return res.send(returnAlerts(alert));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving alert" });
      });
  } else {
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
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Alert.findByPk(id)
    .then((alert) => {
      if (!alert) {
        return res.status(400).send({
          message: `alert with id=${id} was not found!`,
        });
      } else {
        if (!authJwt.cehckIfPermission(req, permission.ALERT_READ)) {
          VendingMachine.findByPk(alert.vendingMachineId).then(
            (vendingmachine) => {
              if (vendingmachine.companyId != req.authUser.companyId) {
                return res.status(400).send({
                  message: "you cannot delete the alerts from other companies",
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
                      message:
                        err.message || "Could not delete alert with id=" + id,
                    });
                  });
              }
            }
          );
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
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Could not find alert with id=" + id,
      });
    });
};
