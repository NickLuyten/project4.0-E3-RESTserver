const db = require("./../models/index");
const Type = db.type;
const permission = require("../const/permissions");
const { authJwt } = require("../middlewares/index");
const User = db.user;

//helper function to store types in db
validateTypeFields = (req, isRequired) => {
  // Validate request
  validationMessages = [];

  if (!req.body.name && isRequired) {
    validationMessages.push("name is required.");
  } else if (req.body.name) {
    if (req.body.name.length < 2) {
      validationMessages.push("name must be at least 2 characters");
    } else if (req.body.name.length > 24) {
      validationMessages.push("name can not be longer than 24 characters");
    }
  }
  if (req.body.sanitizerLimitPerMonth) {
    if (req.body.sanitizerLimitPerMonth >= 0) {
      validationMessages.push(
        "sanitizerLimitPerMonth needs to be higher or equal to 0"
      );
    }
  }

  return validationMessages;
};
storeTypeDatabase = (type, res) => {
  type
    .save(type)
    .then((data) => {
      return res.send(returnType(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the type.",
      });
    });
};
returnType = (data) => {
  return {
    result: {
      id: data.id,
      name: data.name,
      companyId: data.companyId,
      sanitizerLimitPerMonth: data.sanitizerLimitPerMonth,
    },
  };
};

returnTypes = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      name: data.name,
      companyId: data.companyId,
      sanitizerLimitPerMonth: data.sanitizerLimitPerMonth,
    })),
  };
};

// Create and Save a new type
exports.create = (req, res) => {
  let validationMessages = validateTypeFields(req, true);

  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  } else {
    if (!req.body.companyId) {
      req.body.companyId = req.authUser.companyId;
    }
    if (!authJwt.checkIfPermission(req, permission.TYPE_CREATE)) {
      if (req.authUser.companyId != req.body.companyId) {
        return res
          .status(401)
          .send({ message: "Not autherized to create the type " });
      }
    }
    console.log("create function");
    Type.findOne({
      where: {
        companyId: req.body.companyId,
        name: req.body.name,
      },
    }).then((typeFound) => {
      if (!typeFound) {
        let type = new Type({
          companyId: req.body.companyId,
          name: req.body.name,
          sanitizerLimitPerMonth: req.body.sanitizerLimitPerMonth,
        });
        console.log(type);
        storeTypeDatabase(type, res);
      } else {
        return res.status(400).send({
          message: "type already exists",
        });
      }
    });
  }
};

// Find a single type with an id
exports.findOne = async (req, res) => {
  console.log("findone");
  const id = req.params.id;

  Type.findByPk(id)
    .then((data) => {
      console.log("data");
      console.log(data);
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found type with id " + id });
      else {
        if (!authJwt.checkIfPermission(req, permission.TYPE_READ)) {
          return res
            .status(401)
            .send({ message: "Not autherized to get the type with id " + id });
        }
        console.log("test");
        return res.send(returnType(data));
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving type witth id=" + id,
      });
    });
};

// Update a type
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  const id = req.params.id;
  Type.findByPk(id).then((type) => {
    if (!type) {
      return res.status(400).send({
        message: `Cannot get authentication with id=${id}. Maybe authentication string was not found!`,
      });
    } else {
      if (req.body.name) {
        type.name = req.body.name;
      }
      if (req.body.sanitizerLimitPerMonth) {
        type.sanitizerLimitPerMonth = req.body.sanitizerLimitPerMonth;
      }
      if (!authJwt.checkIfPermission(req, permission.TYPE_UPDATE)) {
        if (type.companyId != req.authUser.companyId) {
          return res.status(401).send({
            message: "Not autherized to update the type with id " + id,
          });
        }
      }
      type.save().then((updateType) => {
        if (!updateType) {
          return res.status(400).send({
            message: `Cannot updated type with id=${id}`,
          });
        } else {
          return res.send(returnType(updateType));
        }
      });
    }
  });
};
// Find all types
exports.findAll = async (req, res) => {
  if (!authJwt.checkIfPermission(req, permission.TYPE_READ)) {
    Type.findAll({
      where: {
        companyId: req.authUser.companyId,
      },
    })
      .then((types) => {
        if (!types) return res.status(400).send({ message: "No type found" });
        return res.send(returnTypes(types));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving types" });
      });
  } else {
    Type.findAll()
      .then((types) => {
        if (!types) return res.status(400).send({ message: "No type found" });
        return res.send(returnTypes(types));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving types" });
      });
  }
};
exports.findAllTypesWithCompanyId = async (req, res) => {
  if (!authJwt.checkIfPermission(req, permission.TYPE_READ)) {
    Type.findAll({
      where: {
        companyId: req.authUser.companyId,
      },
    })
      .then((types) => {
        if (!types) return res.status(400).send({ message: "No type found" });
        return res.send(returnTypes(types));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving types" });
      });
  } else {
    Type.findAll()
      .then((types) => {
        if (!types) return res.status(400).send({ message: "No type found" });
        return res.send(returnTypes(types));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving types" });
      });
  }
};

// Delete a type with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findAll({
    where: {
      typeId: id,
    },
  }).then((users) => {
    if (users.length == 0) {
      Type.findByPk(id)
        .then((type) => {
          if (!type) {
            return res.status(400).send({
              message: `Cannot delete type with id=${id}. Maybe type was not found!`,
            });
          } else {
            if (!authJwt.checkIfPermission(req, permission.TYPE_DELETE)) {
              if (req.authUser.companyId == type.companyId) {
                type
                  .destroy()
                  .then(() => {
                    return res.send({
                      message: "type was deleted successfully!",
                    });
                  })
                  .catch((err) => {
                    return res.status(500).send({
                      message:
                        err.message || "Could not delete type with id=" + id,
                    });
                  });
              } else {
                return res
                  .status(401)
                  .send({ message: "Not autherized to delete the type " });
              }
            } else {
              type
                .destroy()
                .then(() => {
                  return res.send({
                    message: "type was deleted successfully!",
                  });
                })
                .catch((err) => {
                  return res.status(500).send({
                    message:
                      err.message || "Could not delete type with id=" + id,
                  });
                });
            }
          }
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message || "Could not find authentication with id=" + id,
          });
        });
    } else {
      return res.status(400).send({
        message: `Cannot delete type because there are users with this type!`,
      });
    }
  });
};

exports.deleteLocal = (req, res, id) => {
  User.findAll({
    where: {
      typeId: id,
    },
  }).then((users) => {
    if (users.length == 0) {
      Type.findByPk(id)
        .then((type) => {
          if (!type) {
            return res.status(400).send({
              message: `Cannot delete type with id=${id}. Maybe type was not found!`,
            });
          } else {
            if (!authJwt.checkIfPermission(req, permission.TYPE_DELETE)) {
              if (req.authUser.companyId == type.companyId) {
                type
                  .destroy()
                  .then(() => {
                    return res.send({
                      message: "type was deleted successfully!",
                    });
                  })
                  .catch((err) => {
                    return res.status(500).send({
                      message:
                        err.message || "Could not delete type with id=" + id,
                    });
                  });
              } else {
                return res
                  .status(401)
                  .send({ message: "Not autherized to delete the type " });
              }
            } else {
              type
                .destroy()
                .then(() => {
                  return res.send({
                    message: "type was deleted successfully!",
                  });
                })
                .catch((err) => {
                  return res.status(500).send({
                    message:
                      err.message || "Could not delete type with id=" + id,
                  });
                });
            }
          }
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message || "Could not find authentication with id=" + id,
          });
        });
    } else {
      return res.status(400).send({
        message: `Cannot delete type because there are users with this type!`,
      });
    }
  });
};
