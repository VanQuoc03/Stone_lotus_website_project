const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");
const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");

router.get(
  "/admin/promotions",
  authenticateToken,
  requireRole("admin"),
  promotionController.getPromotions
);
router.get(
  "/admin/promotions/:id",
  authenticateToken,
  requireRole("admin"),
  promotionController.getPromotionById
);

//Gợi ý mã giảm giá trong giỏ hàng
router.get(
  "/promotions/suggestions",
  promotionController.getSuggestedPromotions
);

router.post(
  "/admin/promotions",
  authenticateToken,
  requireRole("admin"),
  promotionController.addPromotion
);
router.post(
  "/promotions/apply",
  authenticateToken,
  promotionController.applyPromotion
);

router.put(
  "/admin/promotions/:id",
  authenticateToken,
  requireRole("admin"),
  promotionController.updatePromotion
);

router.patch(
  "/admin/promotions/:id/status",
  authenticateToken,
  requireRole("admin"),
  promotionController.toggleStatus
);

router.delete(
  "/admin/promotions/:id",
  authenticateToken,
  requireRole("admin"),
  promotionController.deletePromotion
);

module.exports = router;
