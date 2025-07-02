const express = require("express");
const router = express.Router();
const {
  getSummary,
  getSalesChart,
  getInventorySummary,
  getCategorySummary,
  getRecentOrders,
} = require("../controllers/dashboardController");

const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");

router.get("/", authenticateToken, requireRole("admin"), getSummary);
router.get(
  "/sales-chart",
  authenticateToken,
  requireRole("admin"),
  getSalesChart
);
router.get(
  "/inventory/summary",
  authenticateToken,
  requireRole("admin"),
  getInventorySummary
);

router.get(
  "/category/summary",
  authenticateToken,
  requireRole("admin"),
  getCategorySummary
);

router.get(
  "/orders/recent",
  authenticateToken,
  requireRole("admin"),
  getRecentOrders
);

module.exports = router;
