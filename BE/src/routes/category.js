const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

router.post("/", authenticateToken, requireRole("admin"), createCategory);
router.put("/:id", authenticateToken, requireRole("admin"), updateCategory);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteCategory);

module.exports = router;
