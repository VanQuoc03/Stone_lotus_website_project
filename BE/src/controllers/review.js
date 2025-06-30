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
module.exports = { createReview };
