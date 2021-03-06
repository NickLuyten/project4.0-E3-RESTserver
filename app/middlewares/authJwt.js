const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const VendingMachine = db.vendingMachine;

isTokenPresent = (req) => {
  return req.headers["authorization"] !== undefined;
};

isVendingMachineTokenPresent = (req) => {
  return req.headers["api-key"] !== undefined;
};

extractToken = (req) => {
  return req.headers["authorization"].split("Bearer ")[1];
};
extractVendingMachineToken = (req) => {
  return req.headers["api-key"];
};

verifyToken = (req, res, next) => {
  console.log("this.verifyToken");
  if (!isTokenPresent(req)) {
    return res.status(401).send({ message: "No token provided!" });
  }
  let token = extractToken(req);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Unauthorized!" });
    }
    User.findByPk(decoded.id).then((user) => {
      req.authUser = user;
      next();
    });
  });
};

verifyTokenIfPresent = (req, res, next) => {
  console.log("verifyTokenIfPresent");
  if (!isTokenPresent(req)) {
    next();
    return;
  }
  let token = extractToken(req);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Access denied." });
    }
    User.findByPk(decoded.id).then((user) => {
      req.authUser = user;
      next();
    });
  });
};

isAdmin = (req, res, next) => {
  console.log("isAdmin");
  if (!isTokenPresent(req)) {
    return res.status(401).send({ message: "No token provided!" });
  }
  let token = extractToken(req);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Access denied." });
    }
    User.findByPk(decoded.id).then((user) => {
      if (!user) {
        return res.status(403).send({ message: "user doesn't exist" });
      }
      req.authUser = user;
      if (user.admin) {
        next();
      } else {
        return res
          .status(403)
          .send({ message: "Route requires admin privileges" });
      }
    });
  });
};

hasUserPriviliges = (req, res, next) => {
  console.log("hasUserPriviliges");
  if (!isTokenPresent(req)) {
    return res.status(401).send({ message: "No token provided!" });
  }
  let token = extractToken(req);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Access denied." });
    }
    User.findByPk(decoded.id).then((user) => {
      req.authUser = user;
      if (!user.guest) {
        next();
      } else {
        return res
          .status(403)
          .send({ message: "Route requires at least user privileges" });
      }
    });
  });
};

hasPermission = (permission, checkIfUser = 0, checkifUserInCompany = 0) => {
  return (req, res, next) => {
    if (!isTokenPresent(req)) {
      return res.status(401).send({ message: "No token provided!" });
    }
    let token = extractToken(req);
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Access denied." });
      }
      User.findByPk(decoded.id).then((user) => {
        req.authUser = user;
        req.authUser.permissions = JSON.parse(req.authUser.permissions);
        if (checkifUserInCompany) {
          if (req.authUser.companyId == req.params.id) {
            next();
            return;
          }
        }
        if (checkIfUser) {
          if (req.authUser.id == req.params.id) {
            next();
            return;
          }
        }
        console.log(req.authUser.permissions);
        console.log(permission);
        if (req.authUser.permissions.includes(permission)) {
          next();
        } else {
          let alternatif = permission.replace("_OWN", "");
          if (req.authUser.permissions.includes(alternatif)) {
            next();
          } else {
            alternatif = alternatif.replace("_COMPANY", "");
            if (req.authUser.permissions.includes(alternatif)) {
              next();
            } else {
              return res
                .status(403)
                .send({ message: "Route requires privileges" });
            }
          }
        }
      });
    });
  };
};

isUserOrAdmin = (req, res, next) => {
  console.log("this.isUserOrAdmin");
  console.log("test");
  if (!isTokenPresent(req)) {
    return res.status(401).send({ message: "No token provided!" });
  } else {
    console.log("test1");
    let token = extractToken(req);
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Access denied." });
      }
      User.findByPk(decoded.id).then((user) => {
        console.log("userfound");
        req.authUser = user;
        if (user.id == req.params.id) {
          next();
        } else if (user.admin) {
          next();
        } else {
          return res.status(403).send({
            message:
              "Route requires admin privileges or you need to be the user",
          });
        }
      });
    });
  }
};

checkIfPermission = (req, permission) => {
  if (req.authUser.permissions.includes(permission)) {
    return true;
  } else {
    return false;
  }
};

isVendingMachine = (req, res, next) => {
  if (isVendingMachineTokenPresent(req)) {
    VendingMachine.findOne({
      where: {
        apiKey: extractVendingMachineToken(req),
      },
    }).then((vendingMachine) => {
      if (!vendingMachine) {
        return res
          .status(401)
          .send({ message: "vendingmachine not found with api-key!" });
      } else {
        req.authVendingMachine = vendingMachine;
        next();
      }
    });
  } else {
    return res.status(401).send({ message: "no api-key provided!" });
  }
};

const authJwt = {
  verifyToken,
  verifyTokenIfPresent,
  isAdmin,
  hasUserPriviliges,
  isUserOrAdmin,
  hasPermission,
  checkIfPermission,
  isVendingMachine,
};
module.exports = authJwt;
