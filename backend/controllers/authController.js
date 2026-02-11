const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * LOGIN (Admin / Resident / Security)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ADMIN ONLY: Create Resident / Security
 */
const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role, flatNo } = req.body;

    // Only Resident & Security can be created
    if (!["Resident", "Security"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Flat number required only for Resident
    if (role === "Resident" && !flatNo) {
      return res.status(400).json({ message: "Flat number is required for Resident" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      flatNo: role === "Resident" ? flatNo : null
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        flatNo: user.flatNo
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  login,
  adminCreateUser
};
