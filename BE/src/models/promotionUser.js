const mongoose = require("mongoose");

const promotionUserSchema = new mongoose.Schema({
  promotion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sent_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PromotionUser", promotionUserSchema);
