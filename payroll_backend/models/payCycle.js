//start with models before controllers

const mongoose = require("mongoose");

//payPeriod, startDate, endDate, debitDate, payDate, frequency, payGroup, processed
const payCycleSchema = new mongoose.Schema({
  payGroup: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  frequency: {
    type: String,
    required: true,
    enum: ["weekly", "biweekly", "monthly", "semimonthly"],
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  debitDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  payDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  unarchiveRequested: {
    //new 4.15.2025
    type: Boolean,
    default: false,
  },
  requestedPayDate: {
    type: Date,
    default: null,
  },
  requestedDebitDate: {
    type: Date,
    default: null,
  },
  requestedDueDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("payCycle", payCycleSchema);
