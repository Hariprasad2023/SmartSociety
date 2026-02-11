const Visitor = require("../models/Visitor");


const crypto = require("crypto");

exports.generateVisitorQR = async (req, res) => {
  try {
    const { name, phone, flatNo, purpose } = req.body;

    const qrToken = crypto.randomBytes(20).toString("hex");

    const visitor = await Visitor.create({
      name,
      phone,
      flatNo,
      purpose,
      qrToken,
      createdBy: req.user.id,
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hrs
    });

    res.json({
      qrToken,
      expiresAt: visitor.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyVisitorQR = async (req, res) => {
  try {
    const { qrToken } = req.body;

    const visitor = await Visitor.findOne({ qrToken });

    if (!visitor)
      return res.status(404).json({ message: "Invalid QR" });

    if (visitor.expiresAt < new Date()) {
      visitor.status = "EXPIRED";
      await visitor.save();
      return res.status(400).json({ message: "QR expired" });
    }

    visitor.status = "IN";
    visitor.inTime = new Date();
    visitor.loggedBy = req.user.id;

    await visitor.save();

    res.json({ message: "Visitor allowed", visitor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.addVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, flatNo } = req.body;

    const visitor = await Visitor.create({
      name,
      phone,
      purpose,
      flatNo,
      loggedBy: req.user.id,
    });

    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markExit = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Visitor.findByIdAndUpdate(
      id,
      { status: "OUT", outTime: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Visitor not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
