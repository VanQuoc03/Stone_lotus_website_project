const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  placeOrder,
  getOrderById,
} = require("../controllers/order");
const { authenticateToken } = require("../utils/authMiddleWare");

router.get("/", authenticateToken, getAllOrders);
router.get("/:id", authenticateToken, getOrderById);
router.post("/", authenticateToken, placeOrder);

module.exports = router;
