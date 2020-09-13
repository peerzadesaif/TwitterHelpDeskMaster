const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
module.exports = function(req, res, next) {
  if (!req || !req.headers || !req.headers["x-auth-token"]) {
    return res.status(401).end();
  }
  req.user = jwt.decode(req.headers["x-auth-token"], JWT_SECRET).user;
  return next();
};
