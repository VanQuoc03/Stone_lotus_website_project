const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    total_price: { type: Number, require: true },
    shipping_address: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      City: String,
      district: String,
      ward: String,
      note: String,
    },
    payment_method: { type: String, enum: ["cod", "bank"], required: true },
    status: { type: String, default: "pending" },
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
