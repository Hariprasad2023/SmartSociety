const Facility = require("../models/Facility");

exports.getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ createdAt: -1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFacility = async (req, res) => {
  try {
    const { facility, date } = req.body;

    const newFacility = new Facility({
      facility,
      date,
      user: req.user.id,
    });

    await newFacility.save();
    res.status(201).json(newFacility);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
