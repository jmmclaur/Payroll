const Notification = require("../models/notification"); // You'll need this model

const createNotification = async (req, res) => {
  try {
    const companyCode = req.user.companyCode;
    const { contractId } = req.body;
    const notification = await Notification.create({
      companyCode,
      contractId,
      message: "Unarchive request submitted",
      type: "unarchive_request",
      status: "unread",
    });
    res.status(201).json({ notification });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid data" });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Notification already exists",
      });
    }
    return res.status(500).json({
      message: "An error has occurred on the server",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    // Get notifications for the company
    const notifications = await Notification.find({
      companyCode: req.user.companyCode,
      status: "unread", // Only get unread notifications
    });

    res.json({ notifications });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid data" });
    }
    return res.status(500).json({
      message: "An error has occurred on the server",
    });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
    // Update multiple notifications to read status
    await Notification.updateMany(
      {
        companyCode: req.user.companyCode,
        status: "unread",
      },
      {
        $set: { status: "read" },
      }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid data" });
    }
    return res.status(500).json({
      message: "An error has occurred on the server",
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markNotificationsAsRead,
};
