// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Works for BOTH token formats:
    // 1) { id, role }
    // 2) { user: { id, role } }
    const id = decoded?.id || decoded?.user?.id;
    const role = decoded?.role || decoded?.user?.role;

    if (!id) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    req.user = { id, role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
