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
      city: String,
      district: String,
      ward: String,
      note: String,
    },
    payment_method: { type: String, enum: ["cod", "bank"], required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
    timeline: [
      {
        status: {
          type: String,
          enum: ["pending", "processing", "shipped", "completed", "cancelled"],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
