const db = require("./../models/index");
const alert = db.alert;

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

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  alert
    .findByPk(id)
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
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  const id = req.params.id;
  Alert.findByPk(id).then((alert) => {
    if (!authentication) {
      return res.status(400).send({
        message: `Cannot get alert with id=${id}. Maybe alert string was not found!`,
      });
    } else {
      alert.update(req.body).then((updatedAlert) => {
        if (!updatedAlert) {
          return res.status(400).send({
            message: `Cannot updated alert with id=${id}`,
          });
        } else {
          return res.send(returnAlert(updatedAlert));
        }
      });
    }
  });
};
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
