const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { addNotice, getNotices } = require("../controllers/noticeController");

router.post("/", auth, addNotice);
router.get("/", auth, getNotices);

module.exports = router;
