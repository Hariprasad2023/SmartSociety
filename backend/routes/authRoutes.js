const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  login,
  adminCreateUser
} = require("../controllers/authController");

/**
 * Login route (all roles)
 */
router.post("/login", login);

/**
 * Admin creates Resident / Security
 */
router.post(
  "/create-user",
  auth,
  role("Admin"),
  adminCreateUser
);

module.exports = router;
