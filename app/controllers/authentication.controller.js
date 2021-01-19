const db = require("./../models/index");
const { v4: uuidv4 } = require("uuid");
const Authentication = db.authentication;

//helper function to store user in db
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

// Create and Save a new user
exports.create = (req, res) => {
  console.log("create function");
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
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Authentication.findByPk(id)
    .then((data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found authentication with id " + id });
      else {
        console.log(data);
        return res.send(returnAuthentication(data));
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving authentication string with id=" + id,
      });
    });
};
// Find a single user with an authentication string (uuid)
exports.findByAuthenticationString = (req, res) => {
  const uuid = req.params.uuid;

  Authentication.findOne({
    where: {
      authentication: uuid,
    },
  })
    .then((data) => {
      if (!data)
        return res.status(400).send({
          message:
            "Not found authentication with authentication string " + uuid,
        });
      else {
        console.log(data);
        return res.send(returnAuthentication(data));
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

// Update a user
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
      authentication.vendingMachineId = req.body.vendingMachineId;
      authentication.save().then((updatedAuthentication) => {
        if (!updatedAuthentication) {
          return res.status(400).send({
            message: `Cannot updated vending machine with id=${id}`,
          });
        } else {
          return res.send(returnAuthentication(updatedAuthentication));
        }
      });
    }
  });
};

// Find all users
exports.findAll = (req, res) => {
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
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Authentication.findByPk(id)
    .then((authentication) => {
      if (!authentication) {
        return res.status(400).send({
          message: `Cannot delete authentication with id=${id}. Maybe authentication was not found!`,
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
                err.message || "Could not delete vauthentication with id=" + id,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Could not find authentication with id=" + id,
      });
    });
};
