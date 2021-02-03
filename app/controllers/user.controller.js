const config = require("../config/auth.config");
const db = require("./../models/index");
const User = db.user;
const Company = db.company;
const Authentication = db.authentication;
const AutherizedUserPerMachine = db.autherizedUserPerMachine;
const UserThatReceiveAlertsFromVendingMachine =
  db.userThatReceiveAlertsFromVendingMachine;

const { authJwt } = require("../middlewares/index");
const permission = require("../const/permissions");
const { Op } = require("sequelize");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const permissions = require("../const/permissions");
const Type = db.type;

//helper function to validate userfields
validateUserFields = (req, isRequired) => {
  // Validate request
  validationMessages = [];

  //First Name
  if (!req.body.firstName && isRequired) {
    validationMessages.push("FirstName is required.");
  } else if (req.body.firstName) {
    if (req.body.firstName.length < 2) {
      validationMessages.push("FirstName must be at least 2 characters");
    } else if (req.body.firstName.length > 24) {
      validationMessages.push("FirstName can not be longer than 24 characters");
    }
  }

  //Last Name
  if (!req.body.lastName && isRequired) {
    validationMessages.push("LastName is required.");
  } else if (req.body.lastName) {
    if (req.body.lastName.length < 3) {
      validationMessages.push("LastName must be at least 3 characters");
    } else if (req.body.lastName.length > 56) {
      validationMessages.push("LastName can not be longer than 56 characters");
    }
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!req.body.email && isRequired) {
    validationMessages.push("Email is required.");
  } else if (req.body.email) {
    if (!emailRegex.test(req.body.email)) {
      validationMessages.push(`${req.body.email} is not a valid email`);
    }
  }

  //password validation
  if (!req.body.password && isRequired) {
    validationMessages.push("Password is required.");
  } else if (req.body.password) {
    if (req.body.password.length < 3) {
      validationMessages.push("Password must be at least 3 characters");
    } else if (req.body.password.length > 128) {
      validationMessages.push("Password can not be longer than 128 characters");
    }
  }

  //company vallidation
  if (!req.body.companyId && isRequired) {
    validationMessages.push("CompanyId is required.");
  }
  //type vallidation
  if (!req.body.typeId && isRequired) {
    validationMessages.push("typeId is required.");
  }

  return validationMessages;
};

//helper function to store user in db
storeUserInDatabase = (user, res) => {
  user
    .save(user)
    .then((data) => {
      return res.send(returnUserWithToken(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the user.",
      });
    });
};

//helper function to create a token
createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      admin: user.admin,
      guest: user.guest,
      permissions: JSON.parse(user.permissions),
    },
    config.secret,
    {
      expiresIn: 86400, // 24 hours
    }
  );
};

//helper function to return userObject
returnUserWithToken = (data) => {
  return {
    result: {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      admin: data.admin,
      guest: data.guest,
      companyId: data.companyId,
      typeId: data.typeId,
      accessToken: createToken(data),
      permissions: JSON.parse(data.permissions),
    },
  };
};

//helper function to return userObject
returnUserLimited = (data) => {
  return {
    result: {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      admin: data.admin,
      guest: data.guest,
      companyId: data.companyId,
      typeId: data.typeId,
      permissions: JSON.parse(data.permissions),
    },
  };
};

returnUserLimitedLocal = (data) => {
  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    admin: data.admin,
    guest: data.guest,
    companyId: data.companyId,
    typeId: data.typeId,
    permissions: JSON.parse(data.permissions),
  };
};

returnUsers = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      admin: data.admin,
      guest: data.guest,
      companyId: data.companyId,
      typeId: data.typeId,
      permissions: JSON.parse(data.permissions),
    })),
  };
};

exports.create = (req, res) => {
  console.log("create function");
  let validationMessages = validateUserFields(req, true);

  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  } else {
    if (req.body.admin == true) {
      req.body.guest = false;
    }
    if (!req.body.permissions) {
      req.body.permissions = JSON.stringify([]);
    }
    console.log("req.body.companyId : " + req.body.companyId);

    if (!authJwt.cehckIfPermission(req, permission.USER_CREATE)) {
      if (req.body.companyId != req.authUser.companyId) {
        return res.status(400).send({
          message: "unautherized you can only create users for your company",
        });
      }
    }

    Company.findByPk(req.body.companyId)
      .then((company) => {
        console.log("company");
        console.log(company);
        console.log(!company);

        if (!company) {
          return res.status(400).send({
            message:
              "The company with id " +
              req.body.companyId +
              " was not found while creating a user",
          });
        } else {
          Type.findByPk(req.body.typeId)
            .then((type) => {
              if (!type) {
                return res.status(400).send({
                  message:
                    "The type with id " +
                    req.body.typeId +
                    " was not found while creating a user",
                });
              } else {
                console.log("sanitizerLimitPerMonth");
                //check permissions
                let permissionsRequest = JSON.parse(req.body.permissions);
                console.log(permissionsRequest);
                let permissionsDoNotMatch = false;

                for (let i = 0; i < permissionsRequest.length; i++) {
                  if (permissions.test.indexOf(permissionsRequest[i]) == -1) {
                    permissionsDoNotMatch = true;
                    i = permissionsRequest.length;
                  }
                }
                if (permissionsDoNotMatch) {
                  return res.status(400).send({
                    message:
                      "The user permissions do not match with known permissions",
                  });
                } else {
                  //check if permissions are lower or the same as the user that created this user
                  let authUserPermission = JSON.parse(req.authUser.permissions);
                  let ToHighPermissions = false;
                  console.log(authUserPermission);
                  console.log(permissionsRequest);

                  let alternatif;
                  for (let i = 0; i < permissionsRequest.length; i++) {
                    if (
                      authUserPermission.indexOf(permissionsRequest[i]) == -1
                    ) {
                      alternatif = permissionsRequest[i].replace("_OWN", "");
                      if (authUserPermission.indexOf(alternatif) == -1) {
                        alternatif = alternatif.replace("_COMPANY", "");
                        if (authUserPermission.indexOf(alternatif) == -1) {
                          ToHighPermissions = true;
                          i = permissionsRequest.length;
                        }
                      }
                    }
                  }
                  if (ToHighPermissions) {
                    return res.status(400).send({
                      message:
                        "The user permissions are to high and cannot be given because the user who is creating this user doesn't have the permissions",
                    });
                  } else {
                    console.log("user");
                    let user = new User({
                      firstName: req.body.firstName,
                      lastName: req.body.lastName,
                      email: req.body.email,
                      password: bcrypt.hashSync(req.body.password, 8),
                      admin: req.body.admin,
                      guest: req.body.guest,
                      companyId: req.body.companyId,
                      typeId: req.body.typeId,
                      permissions: JSON.stringify(permissionsRequest),
                    });

                    User.findOne({
                      where: {
                        email: req.body.email,
                      },
                    }).then((response) => {
                      console.log("response : " + response);
                      if (response == null || response.length == 0) {
                        storeUserInDatabase(user, res);
                      } else {
                        return res.status(400).send({
                          message: `Already exists an account with this email: ${user.email}`,
                        });
                      }
                    });
                  }
                }
              }
            })
            .catch((err) => {
              return res.status(500).send({
                message: "error creating user  error : " + err,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).send({
          message: "error creating user  error : " + err,
        });
      });
  }
};

exports.authenticate = (req, res) => {
  let validationMessages = [];

  // Email validation
  if (!req.body.email) {
    validationMessages.push("Email moet ingevuld zijn.");
  }

  //password validation
  if (!req.body.password) {
    validationMessages.push("Password moet ingevuld zijn.");
  }

  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  }

  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          error: "Er is geen gebruiker gevonden met dit e-mailadres.",
        });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(400).send({
          error: "Het wachtwoord is verkeerd.",
        });
      }

      return res.status(200).send(returnUserWithToken(user));
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Error authenticating user with id=" + id });
    });
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found user with id " + id });
      else {
        if (!authJwt.cehckIfPermission(req, permission.USER_CREATE)) {
          if (data.companyId != req.authUser.companyId) {
            return res.status(400).send({
              message:
                "unautherized you can only create users for your company",
            });
          }
        }
        console.log("data : " + JSON.stringify(data));
        return res.send(returnUserLimited(data));
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Error retrieving user with id=" + id });
    });
};

// Update a user
exports.update = async (req, res) => {
  console.log("update");
  let validationMessages = validateUserFields(req, false);
  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  }

  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }
  if (req.body.companyId) {
    if (!authJwt.cehckIfPermission(req, permission.USER_UPDATE)) {
      if (req.body.companyId != req.authUser.companyId) {
        return res.status(400).send({
          message: `unautherized you can not update the company of a user`,
        });
      }
    }
    let company;
    try {
      company = await Company.findByPk(req.body.companyId);
    } catch (err) {
      return res.status(500).send({
        message:
          err.message ||
          "Error retrieving company with id: " + req.body.companyId,
      });
    }
    if (!company) {
      return res.status(400).send({
        message:
          "The company with id " +
          req.body.companyId +
          " was not found while creating a user",
      });
    }
  }
  let type;
  console.log(req.body.typeId);
  if (req.body.typeId) {
    console.log("getType");
    try {
      type = await Type.findByPk(req.body.typeId);
    } catch (err) {
      return res.status(500).send({
        message:
          err.message || "Error retrieving type with id: " + req.body.typeId,
      });
    }
    console.log(type);
    if (!type) {
      return res.status(400).send({
        message:
          "The type with id " +
          req.body.typeId +
          " was not found while creating a user",
      });
    }
  }

  console.log("update2");

  if (req.body.permissions) {
    let permissionsRequest = JSON.parse(req.body.permissions);
    let permissionsDoNotMatch = false;
    for (let i = 0; i < permissionsRequest.length; i++) {
      if (permissions.test.indexOf(permissionsRequest[i]) == -1) {
        permissionsDoNotMatch = true;
        i = permissionsRequest.length;
      }
    }
    if (permissionsDoNotMatch) {
      return res.status(400).send({
        message: "The user permissions do not match with known permissions",
      });
    } else {
      let authUserPermission = JSON.parse(req.authUser.permissions);
      let ToHighPermissions = false;
      console.log(authUserPermission);
      console.log(permissionsRequest);
      console.log("update3");

      let alternatif;
      for (let i = 0; i < permissionsRequest.length; i++) {
        if (authUserPermission.indexOf(permissionsRequest[i]) == -1) {
          alternatif = permissionsRequest[i].replace("_OWN", "");
          if (authUserPermission.indexOf(alternatif) == -1) {
            alternatif = alternatif.replace("_COMPANY", "");
            if (authUserPermission.indexOf(alternatif) == -1) {
              ToHighPermissions = true;
              i = permissionsRequest.length;
            }
          }
        }
      }
      if (ToHighPermissions) {
        return res.status(400).send({
          message:
            "The user permissions are to high and cannot be given because the user who is creating this user doesn't have the permissions",
        });
      }
    }
  }

  console.log("update4");

  const id = req.params.id;
  User.findByPk(id).then((user) => {
    if (!user) {
      return res.status(400).send({
        message: `Cannot get user with id=${id}. Maybe user was not found!`,
      });
    } else {
      if (!authJwt.cehckIfPermission(req, permission.USER_UPDATE)) {
        if (user.companyId != req.authUser.companyId) {
          return res.status(400).send({
            message: `unautherized you can not update the user of another company`,
          });
        }
      }
      if (
        req.body.typeId &&
        ((!req.body.companyId && type.companyId != user.companyId) ||
          (req.body.companyId && type.companyId != req.body.companyId))
      ) {
        return res.status(400).send({
          message: "The type doesn't belong to your company",
        });
      }
      user.update(req.body).then((updatedUser) => {
        if (!updatedUser) {
          return res.status(400).send({
            message: `Cannot update user with id=${id}`,
          });
        } else {
          return res.send(returnUserWithToken(updatedUser));
        }
      });
    }
  });
};

// Update a user
exports.updatePassword = async (req, res) => {
  console.log("updatePassword");

  if (!req.body) {
    return res.status(400).send({ message: "no data?" });
  }
  if (!req.body.password) {
    return res.status(400).send({ message: "passwoord is required" });
  }
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  }

  const id = req.params.id;
  User.findByPk(id).then((user) => {
    if (!user) {
      return res.status(400).send({
        message: `Cannot get user with id=${id}. Maybe user was not found!`,
      });
    } else {
      if (!authJwt.cehckIfPermission(req, permission.USER_UPDATE)) {
        if (user.companyId != req.authUser.companyId) {
          return res.status(400).send({
            message: `unautherized you can not update the user of another company`,
          });
        }
      }
      user.password = req.body.password;
      user.save().then((updatedUser) => {
        if (!updatedUser) {
          return res.status(400).send({
            message: `Cannot update user with id=${id}`,
          });
        } else {
          return res.send(returnUserWithToken(updatedUser));
        }
      });
    }
  });
};

// Find all users
exports.findAll = (req, res) => {
  console.log("user model : " + User);
  if (!authJwt.cehckIfPermission(req, permission.USER_READ)) {
    User.findAll({
      where: {
        companyId: req.authUser.companyId,
      },
    })
      .then((users) => {
        if (!users) return res.status(400).send({ message: "No users found" });
        return res.send(returnUsers(users));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving users" });
      });
  } else {
    User.findAll()
      .then((users) => {
        if (!users) return res.status(400).send({ message: "No users found" });
        return res.send(returnUsers(users));
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: err.message || "Error retrieving users" });
      });
  }
};

exports.findAllForCompany = (req, res) => {
  const id = req.params.id;

  User.findAll({
    where: {
      companyId: id,
    },
  })
    .then((users) => {
      if (!users) return res.status(400).send({ message: "No users found" });
      return res.send(returnUsers(users));
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: err.message || "Error retrieving users" });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  let checkifUserFromSameCompany;
  try {
    checkifUserFromSameCompany = await User.findByPk(id);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error retrieving user with id: " + id });
  }
  if (!checkifUserFromSameCompany) {
  } else {
    if (!authJwt.cehckIfPermission(req, permission.USER_CREATE)) {
      if (checkifUserFromSameCompany.companyId != req.authUser.companyId) {
        return res.status(400).send({
          message: `unautherized you can not delete the user of another company`,
        });
      }
    }
  }

  Authentication.findAll({
    where: {
      userId: id,
    },
  })
    .then((authentications) => {
      console.log("authentications");
      for (let i = 0; i < authentications.length; i++) {
        authentications[i].destroy();
      }
      AutherizedUserPerMachine.findAll({
        where: {
          userId: id,
        },
      })
        .then((autherizedUserPerMachines) => {
          console.log("autherizedUserPerMachines");
          for (let i = 0; i < autherizedUserPerMachines.length; i++) {
            autherizedUserPerMachines[i].destroy();
          }
          UserThatReceiveAlertsFromVendingMachine.findAll({
            where: {
              userId: id,
            },
          })
            .then((userThatReceiveAlertsFromVendingMachines) => {
              console.log("userThatReceiveAlertsFromVendingMachines");
              for (
                let i = 0;
                i < userThatReceiveAlertsFromVendingMachines.length;
                i++
              ) {
                userThatReceiveAlertsFromVendingMachines[i].destroy();
              }
              User.findByPk(id)
                .then((user) => {
                  console.log("user");
                  if (!user) {
                    return res.status(400).send({
                      message: `Cannot delete user with id=${id}. Maybe user was not found!`,
                    });
                  } else {
                    user
                      .destroy()
                      .then(() => {
                        return res.send({
                          message: "User was deleted successfully!",
                        });
                      })
                      .catch((err) => {
                        return res.status(500).send({
                          message:
                            err.message ||
                            "Could not delete user with id=" + id,
                        });
                      });
                  }
                })
                .catch((err) => {
                  return res.status(500).send({
                    message:
                      err.message || "Could not delete user with id=" + id,
                  });
                });
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Could not delete UserThatReceiveAlertsFromVendingMachine when deleting user with id=" +
                    id,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message ||
              "Could not delete AutherizedUserPerMachine when deleting user with id=" +
                id,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Could not delete AutherizedUserPerMachine when deleting user with id=" +
            id,
      });
    });
};
exports.deleteLocal = (req, res, id) => {
  Authentication.findAll({
    where: {
      userId: id,
    },
  })
    .then((authentications) => {
      for (let i = 0; i < authentications.length; i++) {
        authentications[i].destroy();
      }
      AutherizedUserPerMachine.findAll({
        where: {
          userId: id,
        },
      })
        .then((autherizedUserPerMachines) => {
          for (let i = 0; i < autherizedUserPerMachines.length; i++) {
            autherizedUserPerMachines[i].destroy();
          }
          UserThatReceiveAlertsFromVendingMachine.findAll({
            where: {
              userId: id,
            },
          })
            .then((userThatReceiveAlertsFromVendingMachines) => {
              for (
                let i = 0;
                i < userThatReceiveAlertsFromVendingMachines.length;
                i++
              ) {
                userThatReceiveAlertsFromVendingMachines[i].destroy();
              }
              User.findByPk(id)
                .then((user) => {
                  if (!user) {
                    return res.status(400).send({
                      message: `Cannot delete user with id=${id}. Maybe user was not found!`,
                    });
                  } else {
                    user
                      .destroy()
                      .then(() => {
                        return;
                      })
                      .catch((err) => {
                        return res.status(500).send({
                          message:
                            err.message ||
                            "Could not delete user with id=" + id,
                        });
                      });
                  }
                })
                .catch((err) => {
                  return res.status(500).send({
                    message:
                      err.message || "Could not delete user with id=" + id,
                  });
                });
            })
            .catch((err) => {
              return res.status(500).send({
                message:
                  err.message ||
                  "Could not delete UserThatReceiveAlertsFromVendingMachine when deleting user with id=" +
                    id,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message ||
              "Could not delete AutherizedUserPerMachine when deleting user with id=" +
                id,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "Could not delete AutherizedUserPerMachine when deleting user with id=" +
            id,
      });
    });
};
// Creates an admin
exports.createAdmin = async (req, res) => {
  console.log("create function");
  let validationMessages = validateUserFields(req, false);

  // If request not valid, return messages
  if (validationMessages.length != 0) {
    console.log("test");
    return res.status(400).send({ messages: validationMessages });
  } else {
    console.log("test2");

    // let type;
    // try {
    //   type = await Type.findByPk(req.body.typeId);
    // } catch (error) {
    //   return res.status(500).send({
    //     message:
    //       error.message || "error occured when getting type in create admin",
    //   });
    // }
    // if (!type) {
    //   return res.status(400).send({
    //     message:
    //       "The type with id " +
    //       req.body.typeId +
    //       " was not found while creating a admin",
    //   });
    // }
    req.body.admin = true;
    // Create a user
    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      admin: req.body.admin,
      companyId: req.body.companyId,
      typeId: req.body.companyId,
      permissions: JSON.stringify(permissions.adminPermissions),
    });
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((response) => {
      console.log("response : " + response);
      if (response == null || response.length == 0) {
        storeUserInDatabase(user, res);
      } else {
        return res.status(400).send({
          message: `Already exists an account with this email: ${user.email}`,
        });
      }
    });
  }
};

exports.findOneLocal = async (id) => {
  let response;
  try {
    response = await User.findById(id);
  } catch (err) {
    return res
      .status(500)
      .send({ message: err.message || "Error retrieving user with id: " + id });
  }
  if (!response)
    return res.status(400).send({ message: "Not found user with id " + id });

  return returnUserLimitedLocal(response);
};

exports.handgelLimit = async (req, res) => {
  const id = req.params.id;

  User.findByPk(id).then(async (user) => {
    if (!user) {
      return res.status(400).send({
        message: "user not found with id=" + authentication.userId,
      });
    } else {
      let type;
      try {
        type = await Type.findByPk(user.typeId);
      } catch (error) {
        return res.status(500).send({
          message:
            err.message || "Error retrieving type with id: " + req.body.typeId,
        });
      }
      if (!type) {
        return res.status(400).send({
          message:
            "The type with id " +
            req.body.typeId +
            " was not found while creating a user",
        });
      }

      let limit = type.sanitizerLimitPerMonth;
      let greatherDate = new Date();
      greatherDate.setDate(greatherDate.getDate() - 30);
      console.log("greatherDate");
      console.log(greatherDate);

      Authentication.findAll({
        where: {
          userId: user.id,
          updatedAt: {
            [Op.gte]: greatherDate,
          },
          vendingMachineId: {
            [Op.ne]: null,
          },
        },
      }).then((authentications) => {
        console.log(authentications.length + "  /  " + limit);
        return res.send({
          result: { handgels: authentications.length + "  /  " + limit },
        });
      });
    }
  });
};
