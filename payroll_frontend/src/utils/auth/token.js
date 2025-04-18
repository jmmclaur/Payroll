const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  createToken,
  verifyToken,
};
