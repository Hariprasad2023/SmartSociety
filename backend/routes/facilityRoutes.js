const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { addFacility, getFacilities } = require("../controllers/facilityController");

router.post("/", auth, addFacility);
router.get("/", auth, getFacilities);

module.exports = router;
