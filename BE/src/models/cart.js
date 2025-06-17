const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    unique: true,
  },
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart", cartSchema);
