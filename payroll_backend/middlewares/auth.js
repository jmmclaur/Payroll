const { not_authorized } = require("../utils/errors");
const { verifyToken } = require("../utils/token");
const User = require("../models/user"); // Add this line to import User model

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

    // Fetch complete user data
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(not_authorized).send({ message: "User not found" });
    }

    // Attach complete user object to request
    req.user = user;
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
