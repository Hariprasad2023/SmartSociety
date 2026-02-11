const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  flatNo: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  status: {
    type: String,
    enum: ["Unpaid", "Paid"],
    default: "Unpaid"
  },
  paidAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bill", billSchema);
