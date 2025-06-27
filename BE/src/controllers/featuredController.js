const BlogPost = require("../models/blogPost");
const Product = require("../models/product");
const Like = require("../models/Like");
const getFeaturedScore = require("../utils/featuredScore");

const getFeaturedItems = async (req, res) => {
  const { type = "blog", limit = 5 } = req.query;
  try {
    let items = [];

    if (type === "blog") {
      items = await BlogPost.find();
    } else if (type === "product") {
      items = await Product.find().populate("images");
    } else {
      return res.status(400).json({ error: "Loại không hợp lệ" });
    }

    const itemIds = items.map((item) => item._id);

    const likeCounts = await Like.aggregate([
      {
        $match: {
          targetId: { $in: itemIds },
          targetType: type === "blog" ? "BlogPost" : "Product",
        },
      },
      { $group: { _id: "$targetId", count: { $sum: 1 } } },
    ]);

    const likeMap = likeCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const enrichedItems = items.map((item) => {
      const obj = item.toObject();
      obj.likes = likeMap[item._id.toString()] || 0;
      obj.featuredScore = getFeaturedScore({
        views: obj.views || 0,
        likes: obj.likes,
        createdAt: obj.createdAt || new Date(),
      });
      return obj;
    });

    enrichedItems.sort((a, b) => b.featuredScore - a.featuredScore);

    res.json(enrichedItems.slice(0, parseInt(limit)));
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy nội dung nổi bật" });
  }
};

module.exports = { getFeaturedItems };
