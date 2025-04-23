const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createContract,
  getContract,
  getActiveContracts,
  getInactiveContracts,
  archiveContract,
  unarchiveContract,
  requestContract,
} = require("../controllers/payCycles");

//creating and retrieving contracts
router.post("/", auth, createContract);
router.get("/me", auth, getContract);
router.get("/active", auth, getActiveContracts);
router.get("/inactive", auth, getInactiveContracts);

// Archive and unarchive routes
router.patch("/:contractId/archive", auth, archiveContract);
router.patch("/:contractId/unarchive", auth, unarchiveContract);

// Requested route
router.patch("/:contractId/requested", auth, requestContract);

module.exports = router;
