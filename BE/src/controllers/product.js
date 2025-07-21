const Product = require("../models/product");
const ProductImage = require("../models/productImage");
const ProductInventory = require("../models/productInventory");
const mongoose = require("mongoose");
const productPurchase = require("../models/productPurchase");
const OrderItem = require("../models/orderItem");

//Lấy danh sách tất cả sản phẩm
const getAllProduct = async (req, res) => {
  try {
    let {
      category,
      search,
      page = 1,
      limit = 10,
      priceRanges,
      includeInactive,
      sort,
    } = req.query;

    const queryAnd = [];

    // Search theo tên hoặc mô tả
    if (search) {
      queryAnd.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    // Lọc theo danh mục (chuyển về ObjectId nếu là string)
    if (category && category !== "all") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        queryAnd.push({ category: new mongoose.Types.ObjectId(category) });
      }
    }

    //Lọc theo khoảng giá
    if (priceRanges) {
      const ranges = Array.isArray(priceRanges) ? priceRanges : [priceRanges];
      const priceConditions = ranges
        .map((range) => {
          const [min, max] = range.split("-").map(Number);
          if (isNaN(min) || isNaN(max)) return null;
          return { price: { $gte: min, $lt: max } };
        })
        .filter(Boolean);
      if (priceConditions.length > 0) {
        queryAnd.push({ $or: priceConditions });
      }
    }

    // Trạng thái sản phẩm
    if (!includeInactive || includeInactive !== "true") {
      queryAnd.push({ status: "active" });
    }

    const finalQuery = queryAnd.length > 0 ? { $and: queryAnd } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let products = [];
    let total = 0;

    //Xử lý sắp xếp theo tồn kho
    if (sort === "stock_desc") {
      const aggregateQuery = [
        { $match: finalQuery },
        {
          $lookup: {
            from: "productinventories",
            localField: "_id",
            foreignField: "product",
            as: "inventory",
          },
        },
        { $unwind: { path: "$inventory", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "productimages",
            localField: "_id",
            foreignField: "product",
            as: "images",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { "inventory.quantity": -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ];

      const countQuery = [
        { $match: finalQuery },
        {
          $lookup: {
            from: "productinventories",
            localField: "_id",
            foreignField: "product",
            as: "inventory",
          },
        },
        { $count: "total" },
      ];

      const [productResults, countResults] = await Promise.all([
        Product.aggregate(aggregateQuery),
        Product.aggregate(countQuery),
      ]);

      products = productResults;
      total = countResults[0]?.total || 0;
    } else {
      //Các sort khác
      const sortOptions = {
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        name_asc: { name: 1 },
        name_desc: { name: -1 },
        created_desc: { createdAt: -1 },
        created_asc: { createdAt: 1 },
        bestseller: { sold: -1 },
      }[sort] || { createdAt: -1 };

      total = await Product.countDocuments(finalQuery);

      products = await Product.find(finalQuery)
        .populate("category")
        .populate("images")
        .populate("inventory")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
    }

    //Thêm giá nhập cuối
    const purchaseData = await productPurchase.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$product",
          latestPrice: { $first: "$purchasePrice" },
        },
      },
    ]);
    const priceMap = purchaseData.reduce((acc, cur) => {
      acc[cur._id.toString()] = cur.latestPrice;
      return acc;
    }, {});

    const enrichedProducts = products.map((p) => ({
      ...p,
      purchasePrice: priceMap[p._id?.toString()] || 0,
    }));

    return res.json({
      products: enrichedProducts,
      total,
      page: parseInt(page),
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Lỗi truy vấn sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

//Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "ID không hợp lệ" });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
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
      .json({ message: "Lỗi khi tạo sản phẩm", error: error.message });
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

//Xóa nhiều sản phẩm
const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Đã xóa sản phẩm thành công", deletedIds: ids });
  } catch (error) {
    console.error("Bulk Delete Error", error);
    res.status(500).json({ message: "Lỗi khi xóa hàng loạt" });
  }
};

//Cập nhật trạng thái nhiều sản phẩm cùng lúc
const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    await Product.updateMany({ _id: { $in: ids } }, { status });
    res.json({ message: "Đã cập nhật trạng thái", updatedIds: ids });
  } catch (error) {
    console.error("Bulk Status Error:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });
  }
};

// Lấy sản phẩm liên quan cùng danh mục, trừ sản phẩm hiện tại
const getRelatedProducts = async (req, res) => {
  try {
    const { category, exclude, limit = 10 } = req.query;
    if (!category) return res.status(400).json({ message: "Thiếu categoryId" });
    const query = {
      category,
    };
    if (exclude) {
      query._id = { $ne: exclude };
    }

    const related = await Product.find(query)
      .populate("category")
      .populate("images")
      .populate("inventory")
      .limit(parseInt(limit));
    res.json(related);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy sản phẩm liên quan", error: err.message });
  }
};

//Cập nhật trạng thái từng sản phẩm
const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("category")
      .populate("images")
      .populate("inventory");
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật trạng thái", error: err.message });
  }
};

//Xử lý nút search
const autoCompleteSearch = async (req, res) => {
  try {
    const query = req.query.q || "";

    if (!query.trim()) return res.json([]);

    const results = await Product.find({
      name: { $regex: query, $options: "i" },
      status: "active",
    })
      .populate({
        path: "images",
        select: "image_url -_id", // ✅ đúng tên trường bạn dùng
        options: { limit: 1 }, // Lấy ảnh đầu tiên làm đại diện
      })
      .select("name _id")
      .limit(8)
      .lean();

    const formatted = results.map((product) => ({
      _id: product._id,
      name: product.name,
      thumbnail: product.images?.[0]?.image_url || null, // ✅ dùng image_url
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Lỗi autocomplete:", err);
    res.status(500).json({ message: "Lỗi server khi gợi ý sản phẩm" });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  bulkDelete,
  bulkUpdateStatus,
  getRelatedProducts,
  updateProductStatus,
  autoCompleteSearch,
};
