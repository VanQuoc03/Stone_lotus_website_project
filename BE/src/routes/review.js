const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviewsByProduct,
  getReviewedProductsInOrder,
} = require("../controllers/review");
const { authenticateToken } = require("../utils/authMiddleWare");

router.get("/checked/:orderId", authenticateToken, getReviewedProductsInOrder);
router.get("/product/:productId", getReviewsByProduct);
router.post("/", authenticateToken, createReview);

module.exports = router;
