const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: Number,
    views: {
      type: Number,
      default: 0,
    },
    sold: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

//Virtuals
productSchema.virtual("images", {
  ref: "ProductImage",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

productSchema.virtual("inventory", {
  ref: "ProductInventory",
  localField: "_id",
  foreignField: "product",
  justOne: true,
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Product", productSchema);
