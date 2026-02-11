const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  getAllComplaints,
  updateComplaintStatus,
  getMyComplaints,
  addComplaint
} = require("../controllers/complaintController");

router.get("/", auth, role("Admin"), getAllComplaints);
router.put("/:id/status", auth, role("Admin"), updateComplaintStatus);
// Resident
router.post("/", auth, role("Resident"), addComplaint);
router.get("/my", auth, role("Resident"), getMyComplaints);


module.exports = router;
