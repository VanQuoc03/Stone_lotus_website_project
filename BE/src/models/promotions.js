const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  discount_percent: { type: Number },
  discount_amount: { type: Number },
  type: { type: String, enum: ["percent", "fixed"], required: true },
  min_order_value: { type: Number, default: 0 },
  max_uses: { type: Number },
  max_uses_per_user: { type: Number },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  used_count: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "disabled"], default: "active" },
  applicable_users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  applicable_products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  ],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Promotion", promotionSchema);
