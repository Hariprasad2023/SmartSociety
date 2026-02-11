const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    flatNo: String,
    purpose: String,

    // 🔑 QR related
    qrToken: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },

    status: {
      type: String,
      enum: ["PENDING", "IN", "OUT", "EXPIRED"],
      default: "PENDING",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Resident
      required: true,
    },

    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Security
    },

    inTime: Date,
    outTime: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
