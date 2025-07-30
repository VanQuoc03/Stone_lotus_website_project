const Promotion = require("../models/promotions");
const Order = require("../models/order");
const PromotionUser = require("../models/promotionUser");

const addPromotion = async (req, res) => {
  try {
    const newPromotion = new Promotion(req.body);
    const savedPromotion = await newPromotion.save();
    res.status(201).json(savedPromotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ created_at: -1 });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: "Không tìm thấy" });
    }
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const updated = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion)
      return res.status(404).json({ message: "Không tìm thấy mã" });
    promotion.status = promotion.status === "active" ? "disabled" : "active";
    await promotion.save();
    res.json({ status: promotion.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) res.status(404).json({ message: "Không tìm thấy mã" });

    const userOrder = await Order.findOne({ promotion_id: promotion._id });
    if (userOrder) {
      res.status(400).json({ message: "Không thể xóa. Mã đã được sử dụng." });
    }

    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSuggestedPromotions = async (req, res) => {
  const { total, user_id } = req.query;
  const now = new Date();

  if (!user_id || !total) {
    return res
      .status(400)
      .json({ message: "Thiếu user_id hoặc tổng đơn hàng" });
  }
  try {
    const promotions = await Promotion.find({
      status: "active",
      start_date: { $lte: now },
      end_date: { $gte: now },
      min_order_value: { $lte: parseFloat(total) },
    });

    const filtered = [];

    for (const promo of promotions) {
      if (promo.max_uses && promo.used_count > promo.max_uses) continue;

      if (
        promo.applicable_users.length > 0 &&
        !promo.applicable_users.some((u) => u.equals(user_id))
      ) {
        continue;
      }

      const usedByUser = await PromotionUser.countDocuments({
        user_id,
        promotion_id: promo._id,
      });

      if (promo.max_uses_per_user && usedByUser >= promo.max_uses_per_user) {
        continue;
      }
      filtered.push(promo);
    }
    res.json(filtered);
  } catch (error) {
    console.error("Lỗi gợi ý mã:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi tìm mã phù hợp" });
  }
};

const applyPromotion = async (req, res) => {
  try {
    const { code, total, user_id } = req.body;

    const promo = await Promotion.findOne({ code, status: "active" });
    if (!promo)
      return res.status(404).json({ error: "Mã không tồn tại hoặc đã tắt" });

    const now = new Date();
    if (now < promo.start_date || now > promo.end_date)
      return res
        .status(400)
        .json({ error: "Mã đã hết hạn hoặc chưa có hiệu lực" });

    if (promo.min_order_value && total < promo.min_order_value)
      return res
        .status(400)
        .json({ error: "Chưa đủ giá trị đơn hàng tối thiểu" });

    if (promo.max_uses && promo.used_count >= promo.max_uses)
      return res.status(400).json({ error: "Mã đã hết lượt sử dụng" });

    if (promo.max_uses_per_user) {
      const used = await PromotionUser.countDocuments({
        promotion_id: promo._id,
        user_id,
      });
      if (used >= promo.max_uses_per_user)
        return res
          .status(400)
          .json({ error: "Bạn đã dùng mã này quá số lần cho phép" });
    }

    // Tính giảm giá
    let discount = 0;
    if (promo.type === "percent") {
      discount = Math.floor((promo.discount_percent / 100) * total);
      if (promo.discount_amount && discount > promo.discount_amount) {
        discount = promo.discount_amount; // Giảm tối đa
      }
    } else {
      discount = promo.discount_amount;
    }

    // Cập nhật lượt sử dụng của mã khuyến mãi
    promo.used_count += 1;
    await promo.save();

    // Ghi lại người dùng đã sử dụng mã này (nếu có giới hạn trên mỗi người dùng)
    if (promo.max_uses_per_user) {
      const existingPromoUser = await PromotionUser.findOne({
        promotion_id: promo._id,
        user_id,
      });
      if (existingPromoUser) {
        existingPromoUser.usage_count += 1;
        await existingPromoUser.save();
      } else {
        const newPromoUser = new PromotionUser({
          promotion_id: promo._id,
          user_id,
          usage_count: 1,
        });
        await newPromoUser.save();
      }
    }

    return res.json({
      discount,
      message: `Áp dụng thành công mã ${promo.code}`,
      promotion: {
        id: promo._id,
        code: promo.code,
        type: promo.type,
        percent: promo.discount_percent,
        amount: promo.discount_amount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi xử lý mã giảm giá" });
  }
};

const validatePromotion = async (req, res) => {
  try {
    const { code, total, user_id } = req.body;
    const promo = await Promotion.findOne({ code, status: "active" });
    if (!promo) {
      return res.status(200).json({ valid: false });
    }

    const now = new Date();
    if (now < promo.start_date && now < promo.end_date)
      return res.status(200).json({ valid: false });
    if (promo.min_order_value && total < promo.min_order_value)
      return res.status(200).json({ valid: false });
    if (promo.max_uses && promo.used_count >= promo.max_uses)
      return res.status(200).json({ valid: false });

    if (promo.max_uses_per_user) {
      const used = await Promotion.countDocuments({
        promotion_id: promo._id,
        user_id,
      });
      if (used >= promo.max_uses_per_user) {
        return res.status(200).json({ valid: false });
      }
    }

    let discount = 0;
    if (promo.type === "percent") {
      discount = Math.floor((promo.discount_amount / 100) * total);
      if (promo.discount_amount && discount > promo.discount_amount) {
        discount = promo.discount_amount;
      }
    } else {
      discount = promo.discount_amount;
    }
    return res.status(200).json({
      valid: true,
      discount,
      promotion: {
        id: promo._id,
        code: promo.code,
        type: promo.type,
        percent: promo.discount_percent,
        amount: promo.discount_amount,
      },
    });
  } catch (err) {
    console.error("Lỗi validate mã giảm giá:", err);
    return res.status(500).json({ valid: false });
  }
};

module.exports = {
  addPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  toggleStatus,
  deletePromotion,
  getSuggestedPromotions,
  applyPromotion,
  validatePromotion,
};
