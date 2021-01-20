const db = require("./../models/index");
const AutherizedUserPerMachine = db.autherizedUserPerMachine;

//helper function to store user in db
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

// Create and Save a new user
exports.create = (req, res) => {
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
    .catch(() => {
      return res.status(500).send({
        message: "Error creating AutherizedUserPerMachine ",
      });
    });
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AutherizedUserPerMachine.findByPk(id)
    .then((data) => {
      if (!data)
        return res.status(400).send({
          message: "Not found AutherizedUserPerMachine with id " + id,
        });
      else {
        console.log(data);
        return res.send(returnAutherizedUserPerMachine(data));
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Error retrieving AutherizedUserPerMachine string with id=" + id,
      });
    });
};
// Find all users
exports.findAll = (req, res) => {
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
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AutherizedUserPerMachine.findByPk(id)
    .then((autherizedUserPerMachine) => {
      if (!autherizedUserPerMachine) {
        return res.status(400).send({
          message: `Cannot delete autherizedUserPerMachine with id=${id}. Maybe autherizedUserPerMachine was not found!`,
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
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Could not find autherizedUserPerMachine with id=" + id,
      });
    });
};
