const Review = require("../models/review");

async function createReview(req, res) {
  try {
    const { product, order, rating, comment, images } = req.body;

    if (!product || !order || !rating) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const existing = await Review.findOne({
      product,
      user: req.user.id,
      order,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá sản phẩm này trong đơn này rồi" });
    }

    const review = await Review.create({
      product,
      order,
      rating,
      user: req.user.id,
      comment,
      images,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
    console.error("Lỗi review sản phẩm", error);
  }
}

async function getReviewsByProduct(req, res) {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Lỗi lấy review theo sản phẩm", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function getReviewedProductsInOrder(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const reviews = await Review.find({
      order: orderId,
      user: userId,
    }).select("product"); // chỉ lấy product

    const reviewedProductIds = reviews.map((r) => r.product.toString());

    res.status(200).json({ reviewedProductIds });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách sản phẩm đã đánh giá:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = {
  createReview,
  getReviewsByProduct,
  getReviewedProductsInOrder,
};
