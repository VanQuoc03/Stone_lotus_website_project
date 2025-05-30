const mongoose = require("mongoose");

const productInventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    last_updated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductInventory", productInventorySchema);
