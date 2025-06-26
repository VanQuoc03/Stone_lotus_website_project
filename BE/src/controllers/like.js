const Like = require("../models/Like");

exports.like = async (req, res) => {
  const { targetId, targetType } = req.body;
  const userId = req.user.id;

  if (!targetId || !targetType) {
    return res.status(400).json({ message: "Thiếu targetId hoặc targetType" });
  }

  try {
    const exists = await Like.findOne({ user: userId, targetId, targetType });
    if (exists) {
      return res.status(400).json({ message: "Đã like rồi" });
    }

    await Like.create({ user: userId, targetId, targetType });
    return res.status(201).json({ liked: true });
  } catch (err) {
    console.error("Lỗi khi like:", err);
    return res
      .status(500)
      .json({ message: "Lỗi khi like", error: err.message });
  }
};

exports.unlike = async (req, res) => {
  const { targetId, targetType } = req.body;

  const userId = req.user.id;

  try {
    const like = await Like.findOneAndDelete({
      user: userId,
      targetId,
      targetType,
    });
    if (!like) {
      return res.status(400).json({ message: "Chưa like để bỏ" });
    }

    return res.json({ liked: false });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Lỗi khi unlike", error: err.message });
  }
};

exports.getLikeCount = async (req, res) => {
  const { targetId, targetType } = req.query;

  try {
    const count = await Like.countDocuments({ targetId, targetType });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đếm like", error: err.message });
  }
};

exports.checkUserLiked = async (req, res) => {
  const { targetId, targetType } = req.query;
  const userId = req.user.id;

  try {
    const liked = await Like.exists({ user: userId, targetId, targetType });
    res.json({ liked: !!liked });
  } catch (err) {
    res.status(500).json({ message: "Lỗi kiểm tra like", error: err.message });
  }
};
