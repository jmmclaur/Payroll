const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    companyCode: {
      type: String,
      required: true,
    },
    contractId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  { timestamps: true } //treat as a second argument, will add createdAt and updatedAt automatically
);

module.exports = mongoose.model("notification", notificationSchema);
