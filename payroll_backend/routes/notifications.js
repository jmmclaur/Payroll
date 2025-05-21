const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createNotification,
  getNotifications,
  markNotificationsAsRead,
} = require("../controllers/notifications");

router.post("/", createNotification);
router.get("/", getNotifications);
router.post("/mark-read", markNotificationsAsRead);

module.exports = router;
