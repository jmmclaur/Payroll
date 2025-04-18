//auth.js must run first b/c it will verify the token, decode user info, and set req.user
//the req.user contains the user's role

const { not_authorized } = require("../utils/errors");
const { verifyToken } = require("../utils/token");

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(not_authorized)
        .send({ message: "Authorization required" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(not_authorized).send({
      message:
        err.message === "Invalid token"
          ? "Invalid token"
          : "Authorization required",
    });
  }
};

module.exports = {
  auth,
};
