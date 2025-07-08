const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    total_price: { type: Number, require: true },
    shipping_address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String },
      city: { type: String },
      district: { type: String },
      ward: { type: String },
      note: { type: String },
    },
    payment_method: { type: String, enum: ["cod", "bank"], required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
    timeline: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "completed",
            "cancelled",
          ],
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
    cancelledAt: { type: Date },
    cancelledBy: { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
