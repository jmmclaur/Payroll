const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createNotification,
  getNotifications,
  markNotificationsAsRead,
} = require("../controllers/notifications");

router.post("/", auth, createNotification);
router.get("/", auth, getNotifications);
router.patch("/read", auth, markNotificationsAsRead);

module.exports = router;
