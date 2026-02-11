const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { createBill, getAllBills, updateBillStatus ,getMyBills} = require("../controllers/billController");

router.post("/", auth, role("Admin"), createBill);
router.get("/", auth, role("Admin"), getAllBills);

// ✅ NEW
router.put("/:id/status", auth, role("Admin"), updateBillStatus);

// Resident
router.get("/my", auth, role("Resident"), getMyBills);


module.exports = router;
