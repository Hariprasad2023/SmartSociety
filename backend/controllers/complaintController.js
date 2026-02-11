const Complaint = require("../models/Complaint");

// Resident: add complaint
const addComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      userId: req.user.id
    });
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ✅ Resident: my complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Admin: get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getMyComplaints
};
