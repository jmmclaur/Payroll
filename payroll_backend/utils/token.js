const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const createToken = (user) => {
  // Create payload with user info including role
  const payload = {
    _id: user._id,
    email: user.email,
    //role: user.role, // Add role to the payload
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  createToken,
  verifyToken,
};

/*original token.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}; //this creates a token that is used to verify a user in the db

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
}; //how to verify the token

module.exports = {
  createToken,
  verifyToken,
}; */
