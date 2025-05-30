const Category = require("../models/Category");
const Product = require("../models/product");
//Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
  const categories = await Category.find().populate("parent");
  res.json(categories);
};

//Lấy danh mục theo ID
const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id).populate("parent");
  if (!category)
    return res.status(404).json({ message: "Không tìm thấy danh mục" });
  res.json(category);
};

//Thêm danh mục
const createCategory = async (req, res) => {
  const { name, parent } = req.body;
  const category = new Category({ name, parent: parent || null });
  await category.save();
  res.status(201).json(category);
};

//Sửa danh mục
const updateCategory = async (req, res) => {
  const { name, parent } = req.body;
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      parent: parent || null,
    },
    { new: true }
  );
  if (!updated)
    return res.status(404).json({ message: "Không cập nhật được danh mục" });
  res.json(updated);
};

//Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const linkedProducts = await Product.find({ category: req.params.id });
    if (linkedProducts.length > 0) {
      return res.status(403).json({
        message: "Không thể xóa danh mục vì có sản phẩm liên kết",
      });
    }
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không xóa được danh mục" });
    res.json({ message: "Đã xóa danh mục" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa danh mục",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
