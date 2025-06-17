const mongoose = require("mongoose");

const productPurchaseSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Số lượng phải lớn hơn 0"],
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: [0, "Giá nhập phải >= 0"],
    },
    purchaseDate: {
      type: Date,
      default: () => Date.now(),
    },
  },
  { timestamps: true, collection: "product_purchases" }
);

module.exports = mongoose.model("ProductPurchase", productPurchaseSchema);
