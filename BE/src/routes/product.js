const express = require("express");

const {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
} = require("../controllers/product");

const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProductById);

router.post("/", authenticateToken, requireRole("admin"), createProduct);
router.put("/:id", authenticateToken, requireRole("admin"), updateProduct);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteProduct);

// Cập nhật tồn kho sản phẩm
router.put(
  "/:id/stock",
  authenticateToken,
  requireRole("admin"),
  updateProductStock
);

module.exports = router;
