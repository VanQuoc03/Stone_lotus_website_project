const Product = require("../models/product");
const ProductPurchase = require("../models/productPurchase");
const ProductInventory = require("../models/productInventory");

const createPurchase = async (req, res) => {
  try {
    const { product, quantity, purchasePrice } = req.body;

    if (!product || quantity === null || purchasePrice === null) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc: sản phẩm, số lượng hoặc giá nhập",
      });
    }
    if (quantity <= 0 || purchasePrice < 0) {
      return res
        .status(400)
        .json({ message: "Số lượng và giá nhập phải là số hợp lý" });
    }

    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    //Tạo bản ghi nhập hàng
    const newPurchase = new ProductPurchase({
      product,
      quantity,
      purchasePrice,
    });

    await newPurchase.save();
    //Cập nhật số lượng tồn kho, Nếu chưa có thì tự động tạo mới
    await ProductInventory.findOneAndUpdate(
      { product },
      {
        $inc: { quantity },
        $set: { purchasePrice, last_updated: new Date() },

      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      message: "Nhập hàng thành công",
      purchase: newPurchase,
    });
  } catch (error) {
    console.error("Lỗi khi tạo nhập hàng: ", error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trên server", error: error.message });
  }
};

module.exports = { createPurchase };
