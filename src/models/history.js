const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    pin_Id: {
      type: String,
    },
    pin_Name: {
      type: String,
    },
    switch_on_time: {
      type: Date,
      default: Date.now(),
    },
    switch_off_time: {
      type: Date,
    },
    duration: {
      type: String,
      default: null,
    },
    cost: {
      type: Number,
      default: 0,
    },
    consumptionWattPrHr: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);