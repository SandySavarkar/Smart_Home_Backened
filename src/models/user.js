const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    is_deleted: { type: Boolean, default: false },
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
    type: { type: String, default: "user" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);