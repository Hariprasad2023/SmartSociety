// middleware/roleMiddleware.js

module.exports = (roles = []) => {
  // ✅ Allow passing a single role as string
  if (typeof roles === "string") {
    roles = [roles];
  }

  // ✅ Fallback safety (prevents roles.map crash)
  if (!Array.isArray(roles)) {
    roles = [];
  }

  return (req, res, next) => {
    // Auth middleware must already set req.user
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userRole = String(req.user.role || "").toLowerCase();

    // If no roles specified, allow access (optional behavior)
    if (roles.length === 0) {
      return next();
    }

    const allowedRoles = roles.map((r) => String(r).toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
