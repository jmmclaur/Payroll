const Notification = require("../models/notification"); // You'll need this model

const createNotification = async (req, res) => {
  try {
    const companyCode = req.user.companyCode;
    const { contractId, message } = req.body; // Add message to destructuring
    const notification = await Notification.create({
      companyCode,
      contractId,
      message: `Client from ${companyCode} wants to unarchive ${contractId}`,
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
    console.log("User data:", {
      id: req.user._id,
      role: req.user.role,
      companyCode: req.user.companyCode,
    });

    let query = {};

    if (req.user.role !== "admin") {
      // Regular users only see their company's unread notifications
      query.companyCode = req.user.companyCode;
      query.status = "unread";
    } else {
      // Admins see all notifications by default
      if (req.query.includeRead !== "true") {
        query.status = "unread";
      }
    }

    console.log("Query:", query);

    const notifications = await Notification.find(query).sort({
      createdAt: -1,
    });

    console.log("Found notifications:", notifications.length);

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
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds)) {
      return res
        .status(400)
        .json({ message: "notificationIds must be an array" });
    }

    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        status: "unread",
      },
      {
        $set: { status: "read" },
      }
    );

    res.json({
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
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
