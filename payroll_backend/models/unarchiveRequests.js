/*
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unarchiveRequestSchema = new Schema(
  {
    contract: {
      type: Schema.Types.ObjectId,
      ref: "Contract", // Reference to your Contract model
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to your User model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    responseDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UnarchiveRequest", unarchiveRequestSchema);
*/
