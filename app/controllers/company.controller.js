const db = require("./../models/index");
const Company = db.company;
const VendingMachine = db.vendingMachine;
const VendingMachineController = require("./vendingMachine.controller");

const User = db.user;
const UserController = require("./user.controller");

returnCompany = (data) => {
  return {
    result: {
      id: data.id,
      name: data.name,
      location: data.location,
    },
  };
};

returnCompanys = (data) => {
  return {
    results: data.map((data) => ({
      id: data.id,
      name: data.name,
      location: data.location,
    })),
  };
};

// Create and Save a new user
exports.create = (req, res) => {
  console.log("create function company");

  console.log(req.body.name + "  /  " + req.body.location);
  let company = new Company({
    name: req.body.name,
    location: req.body.location,
  });
  console.log(company);
  company
    .save()
    .then((data) => {
      console.log("data");
      return res.send(returnCompany(data));
    })
    .catch((err) => {
      return res.status(500).send({
        message: err || "Error creating company",
      });
    });
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Company.findByPk(id)
    .then((data) => {
      if (!data)
        return res
          .status(400)
          .send({ message: "Not found company with id " + id });
      else {
        console.log(data);
        return res.send(returnCompany(data));
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error retrieving company with id=" + id,
      });
    });
};

// Find all users
exports.findAll = (req, res) => {
  Company.findAll()
    .then((company) => {
      if (!company)
        return res.status(400).send({ message: "No company found" });
      return res.send(returnCompanys(company));
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: err.message || "Error retrieving company" });
    });
};
//Update a user
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "geen data?" });
  }
  const id = req.params.id;
  Company.findByPk(id).then((company) => {
    if (!company) {
      return res.status(400).send({
        message: `Cannot get company with id=${id}. Maybe company  was not found!`,
      });
    } else {
      company.update(req.body).then((updatedCompany) => {
        if (!updatedCompany) {
          return res.status(400).send({
            message: `Cannot updated company with id=${id}`,
          });
        } else {
          return res.send(returnCompany(updatedCompany));
        }
      });
    }
  });
};
// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  VendingMachine.findAll({
    where: {
      companyId: id,
    },
  })
    .then((vendingmachines) => {
      console.log("vending machnes");
      console.log(vendingmachines);
      for (let i = 0; i < vendingmachines.length; i++) {
        console.log("delete");
        console.log(vendingmachines[i].id);
        VendingMachineController.deleteLocal(req, res, vendingmachines[i].id);
      }
      User.findAll({
        where: {
          companyId: id,
        },
      })
        .then((users) => {
          console.log("users");
          console.log(users);
          for (let i = 0; i < users.length; i++) {
            console.log("delete");
            console.log(users[i].id);
            UserController.deleteLocal(req, res, users[i].id);
          }

          Company.findByPk(id)
            .then((company) => {
              if (!company) {
                return res.status(400).send({
                  message: `Cannot delete company with id=${id}. Maybe company was not found!`,
                });
              } else {
                company
                  .destroy()
                  .then(() => {
                    console.log("deleted company");
                    return res.send({
                      message: "company was deleted successfully!",
                    });
                  })
                  .catch((err) => {
                    return res.status(500).send({
                      message:
                        err.message || "Could not delete company with id=" + id,
                    });
                  });
              }
            })
            .catch((err) => {
              return res.status(500).send({
                message: err.message || "Could not find company with id=" + id,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            message:
              err.message ||
              "there was an erro in deleting users of company with id=" + id,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message ||
          "there was an erro in deleting vending machines of company with id=" +
            id,
      });
    });
};
