const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  placeOrder,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order");
const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");

router.get("/", authenticateToken, requireRole("admin"), getAllOrders);
router.get("/:id", authenticateToken, getOrderById);
router.post("/", authenticateToken, placeOrder);
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole("admin"),
  updateOrderStatus
);

module.exports = router;
