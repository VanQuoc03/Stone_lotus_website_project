const Product = require("../models/product");

const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
      .sort({ sold: -1 })
      .limit(5)
      .populate("images")
      .populate("inventory")
      .lean();

    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm bán chạy:", err);
    res.status(500).json({ message: "Không thể lấy sản phẩm bán chạy" });
  }
};

module.exports = { getBestSellingProducts };
