const express = require("express");
const router = express.Router();

const { createReview } = require("../controllers/review");
const { authenticateToken } = require("../utils/authMiddleWare");

router.post("/", authenticateToken, createReview);

module.exports = router;
