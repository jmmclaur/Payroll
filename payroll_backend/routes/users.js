const router = require("express").Router();
const { getCurrentUser, modifyUserData } = require("../controllers/users");

router.get("/me", getCurrentUser); //retrieves the user
router.patch("/me", modifyUserData); //updates the user
module.exports = router;
