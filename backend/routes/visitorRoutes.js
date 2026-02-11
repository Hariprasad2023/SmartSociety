const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/roleMiddleware");
const { addVisitor, getVisitors, markExit, generateVisitorQR, verifyVisitorQR } = require("../controllers/visitorController");

router.get("/", auth, allow(["Security", "Admin"]), getVisitors);
router.post("/", auth, allow(["Security"]), addVisitor);
router.put("/:id/exit", auth, allow(["Security"]), markExit);

// Resident generates QR
router.post("/qr", auth, allow("Resident"), generateVisitorQR);

// Security scans QR
router.post("/verify", auth, allow("Security"), verifyVisitorQR);

module.exports = router;
