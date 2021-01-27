const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const permissions = require("../const/permissions.js");
const db = require("../models");
const User = db.user;
// const Match = db.match;

isTokenPresent = (req) => {
  return req.headers["authorization"] !== undefined;
};

extractToken = (req) => {
  return req.headers["authorization"].split("Bearer ")[1];
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
//basically if admin than continue
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

//basically if admin than continue
// hasPermission = (permission) => {
//   console.log("hasPermission");
//   return (req, res, next) => {
//     if (!isTokenPresent(req)) {
//       return res.status(401).send({ message: "No token provided!" });
//     }
//     let token = extractToken(req);
//     jwt.verify(token, config.secret, (err, decoded) => {
//       if (err) {
//         return res.status(403).send({ message: "Access denied." });
//       }
//       User.findByPk(decoded.id).then((user) => {
//         req.authUser = user;
//         if (user.permissions.includes(permission)) {
//           next();
//         } else {
//           let alternatif = permission.replace("_COMPANY", "");
//           if (user.permissions.includes(alternatif)) {
//             next();
//           } else {
//             return res
//               .status(403)
//               .send({ message: "Route requires privileges" });
//           }
//         }
//       });
//     });
//   };
// };

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
        if (user.permissions.includes(permission)) {
          next();
        } else {
          let alternatif = permission.replace("_OWN", "");
          if (user.permissions.includes(alternatif)) {
            next();
          } else {
            alternatif = alternatif.replace("_COMPANY", "");
            if (user.permissions.includes(alternatif)) {
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

// hasPermissionMatchScore = () => {
//   return (req, res, next) => {
//     if (!isTokenPresent(req)) {
//       return res.status(401).send({ message: 'No token provided!' });
//     }
//     let token = extractToken(req);
//     jwt.verify(token, config.secret, (err, decoded) => {
//       if (err) {
//         return res.status(403).send({ message: 'Access denied.' });
//       }
//       User.findById(decoded.id).then((user) => {
//         req.authUser = user;
//         const id = req.params.id;
//         Match.findById(id).then((match) => {
//           var users = match.players.map((u) => u.user);
//           if (users.includes(user._id)) {
//             next();
//           } else {
//             return res.status(403).send({ message: 'Route requires privileges' });
//           }
//         });
//       });
//     });
//   };
// };

//basically if admin or the logged in UserID is the same as the Parameter UserID
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

cehckIfPermission = (req, permission) => {
  if (req.authUser.permissions.includes(permission)) {
    return true;
  } else {
    return false;
  }
};

const authJwt = {
  verifyToken,
  verifyTokenIfPresent,
  isAdmin,
  hasUserPriviliges,
  isUserOrAdmin,
  hasPermission,
  cehckIfPermission,
  // hasPermissioncreateAuthentication,
  // hasPermissionOrIsUserItself,
  // hasPermissionMatchScore,
};
module.exports = authJwt;
