const express = require("express");

const { getInventory, updateInventory } = require("../controllers/inventory");
const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");
const router = express.Router();

router.get(
  "/:productId",
  authenticateToken,
  requireRole("admin"),
  getInventory
);
router.put(
  "/:productId",
  authenticateToken,
  requireRole("admin"),
  updateInventory
);

module.exports = router;
