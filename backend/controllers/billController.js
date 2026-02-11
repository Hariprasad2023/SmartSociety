const Bill = require("../models/Bill");
const User = require("../models/User");

const createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NEW: Admin update bill status
const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Unpaid", "Paid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const update = {
      status,
      paidAt: status === "Paid" ? new Date() : null
    };

    const bill = await Bill.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getMyBills = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "Resident") {
      const user = await User.findById(req.user.id);

      if (!user || !user.flatNo) {
        return res.status(400).json({ message: "Flat not linked to resident" });
      }

      filter.flatNo = user.flatNo; // ✅ KEY FIX
    }

    const bills = await Bill.find(filter).sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBill,
  getAllBills,
  updateBillStatus,
  getMyBills
};
