const config = require("../config/auth.config");
const db = require("./../models/index");
const User = db.user;
const Company = db.company;
const Authentication = db.authentication;
const AutherizedUserPerMachine = db.autherizedUserPerMachine;
const UserThatReceiveAlertsFromVendingMachine =
  db.userThatReceiveAlertsFromVendingMachine;
// const { test } = require("../const/permissions");
// const { adminPermissions, userPermissions } = require("../const/permissions");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { autherizedUserPerMachine } = require("./../models/index");
const permissions = require("../const/permissions");

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

  //Last Name
  if (!req.body.password && isRequired) {
    validationMessages.push("Password is required.");
  } else if (req.body.password) {
    if (req.body.password.length < 3) {
      validationMessages.push("Password must be at least 3 characters");
    } else if (req.body.password.length > 128) {
      validationMessages.push("Password can not be longer than 128 characters");
    }
  }

  //Last Name
  if (!req.body.companyId && isRequired) {
    validationMessages.push("CompanyId is required.");
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
    // dateOfBirth: data.dateOfBirth,
    // imageURL: data.imageURL,
    // permissions: data.permissions,
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
    })),
  };
};

// Create and Save a new user
exports.create = (req, res) => {
  console.log("create function");
  let validationMessages = validateUserFields(req, true);

  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  } else {
    if (!req.body.admin) {
      req.body.admin = false;
    } else {
      req.body.guest = false;
    }
    if (!req.body.guest) {
      req.body.guest = false;
    }
    if (!req.body.permissions) {
      req.body.permissions = [];
    }
    console.log("req.body.companyId : " + req.body.companyId);
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
          console.log("sanitizerLimitPerMonth");
          //check permissions
          let permissionsRequest = req.body.permissions;
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
            let authUserPermission = req.authUser.permissions;
            let ToHighPermissions = false;

            for (let i = 0; i < permissionsRequest.length; i++) {
              if (authUserPermission.indexOf(permissionsRequest[i]) == -1) {
                let alternatif = permissionsRequest[i].replace("_COMPANY", "");
                if (authUserPermission.indexOf(alternatif) == -1) {
                  ToHighPermissions = true;
                  i = permissionsRequest.length;
                }
              }
            }
            if (permissionsDoNotMatch) {
              return res.status(400).send({
                message:
                  "The user permissions are to high and cannot be given because the user who is creating this user doesn't have the permissions",
              });
            } else {
              if (!req.body.sanitizerLimitPerMonth) {
                req.body.sanitizerLimitPerMonth = 0;
              }
              console.log("user");
              let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                admin: req.body.admin,
                guest: req.body.guest,
                companyId: req.body.companyId,
                sanitizerLimitPerMonth: 0,
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
    // Create a user

    // const imageFilePaths = req.files.map((file) => req.protocol + '://' + req.get('host') + '/images/' + file.filename);

    // if (imageFilePaths[0]) {
    //   user.imageURL = imageFilePaths[0];
    // } else {
    //   user.imageURL = 'https://rainbow-flick-backend-app.herokuapp.com/images/placeholder.png';
    // }

    // user.permissions = [...userPermissions];
  }
};

exports.authenticate = (req, res) => {
  let validationMessages = [];

  // Email validation
  if (!req.body.email) {
    validationMessages.push("Email moet ingevuld zijn.");
  }

  //Last Name
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
        return res.send({
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
  // let user = req.body;

  // if (req.files) {
  //   const imageFilePaths = req.files.map((file) => req.protocol + '://' + req.get('host') + '/images/' + file.filename);
  //   if (imageFilePaths[0]) {
  //     user.imageURL = imageFilePaths[0];
  //   }
  // }

  const id = req.params.id;
  User.findByPk(id).then((user) => {
    if (!user) {
      return res.status(400).send({
        message: `Cannot get user with id=${id}. Maybe user was not found!`,
      });
    } else {
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
  // User.findByIdAndUpdate(id, req.body, { new: true, useFindAndModify: false })
  //   .then((data) => {
  //     if (!data) {
  //       return res.status(400).send({
  //         message: `Cannot update user with id=${id}. Maybe user was not found!`,
  //       });
  //     } else return res.send(returnUserWithToken(data));
  //   })
  //   .catch((err) => {
  //     return res.status(500).send({
  //       message: "Error updating with id=" + id,
  //     });
  //   });
};

// Update a user
exports.updatePassword = async (req, res) => {
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
};

// Delete a user with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;
//   User.findByPk(id)
//     .then((user) => {
//       if (!user) {
//         return res.status(400).send({
//           message: `Cannot delete user with id=${id}. Maybe user was not found!`,
//         });
//       } else {
//         user
//           .destroy()
//           .then(() => {
//             return res.send({
//               message: "User was deleted successfully!",
//             });
//           })
//           .catch((err) => {
//             return res.status(500).send({
//               message: err.message || "Could not delete user with id=" + id,
//             });
//           });
//       }
//     })
//     .catch((err) => {
//       return res.status(500).send({
//         message: err.message || "Could not delete user with id=" + id,
//       });
//     });
// };
exports.delete = (req, res) => {
  const id = req.params.id;
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
exports.createAdmin = (req, res) => {
  console.log("create function");
  let validationMessages = validateUserFields(req, true);

  // If request not valid, return messages
  if (validationMessages.length != 0) {
    return res.status(400).send({ messages: validationMessages });
  } else {
    req.body.admin = true;
    // Create a user
    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      admin: req.body.admin,
      sanitizerLimitPerMonth: req.body.sanitizerLimitPerMonth,
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
