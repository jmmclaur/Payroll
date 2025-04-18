const express = require("express");
const router = express.Router();
const { not_found } = require("../utils/errors");
const userRouter = require("./users");
const payCycleRouter = require("./payCycles");
const { auth } = require("../middlewares/auth"); //protect the routes
//const { checkRole } = require("../middlewares/role");
const { login, createUser } = require("../controllers/users");
const {
  getActiveContracts,
  getInactiveContracts,
  archiveContract,
  unarchiveContract,
} = require("../controllers/payCycles");

// Authentication routes (no auth middleware needed)
router.post("/signin", login);
router.post("/signup", createUser);

// User routes (protected)
router.use("/users", auth, userRouter);

// PayCycle routes (protected)
router.use("/payCycles", auth, payCycleRouter);

// PayCycle specific routes (protected)
router.post("/current", auth, getActiveContracts);
router.post("/submitted", auth, archiveContract);
router.post("/missed", auth, [getInactiveContracts, unarchiveContract]);

router.use((req, res) => {
  res.status(not_found).send({ message: "Not found" });
});

module.exports = router;
