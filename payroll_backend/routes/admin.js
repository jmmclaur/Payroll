const router = require("express").Router();
const { searchContracts } = require("../controllers/admin");
const { isAdmin } = require("../middleware/auth"); // Add this import

router.get("/contracts/search", isAdmin, searchContracts);
router.get("/requested", auth, payCycleController.getRequestedContracts);

module.exports = router;
