const Product = require("../models/product");
const ProductImage = require("../models/productImage");
const ProductInventory = require("../models/productInventory");

//Lấy danh sách tất cả sản phẩm
const getAllProduct = async (req, res) => {
  try {
    const { category, search } = req.query;

    const query = {}; 
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("category")
      .populate("images")
      .populate("inventory");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

//Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("images")
      .populate("inventory");
    if (!product)
      return res
        .status(404)
        .json({ message: "Lỗi không lấy được sản phẩm theo ID" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

//Tạo sản phẩm
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, images } = req.body;

    const product = new Product({ name, description, price, category });
    await product.save();

    await ProductInventory.create({
      product: product._id,
      quantity: quantity || 0,
    });

    if (images && Array.isArray(images)) {
      const imageDocs = images.map((url) => ({
        product: product._id,
        image_url: url,
      }));
      await ProductImage.insertMany(imageDocs);
    }

    const fullProduct = await Product.findById(product._id)
      .populate("category")
      .populate("images")
      .populate("inventory");
    res.status(201).json(fullProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo sản phẩm", error: err.message });
  }
};

//Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, images } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        price,
        category,
      },
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await ProductInventory.findOneAndUpdate(
      { product: updatedProduct._id },
      { quantity, last_updated: new Date() },
      { upsert: true }
    );
    await ProductImage.deleteMany({ product: updatedProduct._id });
    if (images && Array.isArray(images)) {
      const newImages = images.map((url) => ({
        product: updatedProduct._id,
        image_url: url,
      }));
      await ProductImage.insertMany(newImages);
    }
    const fullProduct = await Product.findById(updatedProduct._id)
      .populate("category")
      .populate("images")
      .populate("inventory");
    res.json(fullProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật sản phẩm", error: err.message });
  }
};

//Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await ProductImage.deleteMany({ product: deleted._id });
    await ProductInventory.deleteMany({ product: deleted._id });
    res.json("Đã xóa sản phẩm");
  } catch (err) {
    console.error("Lỗi xóa sản phẩm:", err);
    res.status(500).json({ message: "Lỗi xóa sản phẩm", error: err.message });
  }
};

//Cập nhật tồn kho sản phẩm
const updateProductStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    console.log("ID:", req.params.id);
    console.log("BODY:", req.body);

    if (!quantity && quantity !== 0) {
      return res.status(400).json({ message: "Thiếu dữ liệu quantity" });
    }

    await ProductInventory.findOneAndUpdate(
      { product: productId },
      { quantity, last_updated: new Date() },
      { upsert: true }
    );
    res.json({ message: "Đã cập nhật tồn kho sản phẩm thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật tồn kho", error: err.message });
  }
};
module.exports = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
};
