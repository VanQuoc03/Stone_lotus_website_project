const express = require("express");

const {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStock,
  bulkDelete,
  bulkUpdateStatus,
  getRelatedProducts,
  updateProductStatus,
  autoCompleteSearch,
} = require("../controllers/product");

const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");

const router = express.Router();

router.get("/", getAllProduct);
//Sản phẩm liên quan
router.get("/related", getRelatedProducts);

//Tìm kiếm sản phẩm
router.get("/autocomplete", autoCompleteSearch);

router.get("/:id", getProductById);

//Bulk Delete Sản phẩm & update Status
router.post(
  "/bulk-delete",
  authenticateToken,
  requireRole("admin"),
  bulkDelete
);
router.patch(
  "/bulk-status",
  authenticateToken,
  requireRole("admin"),
  bulkUpdateStatus
);

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

//Cập nhật trạng thái sản phẩm
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole("admin"),
  updateProductStatus
);

module.exports = router;
