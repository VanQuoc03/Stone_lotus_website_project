const blogPost = require("../models/blogPost");
const blogComment = require("../models/blogComment");
const { error } = require("console");

const getAllPost = async (req, res) => {
  try {
    const posts = await blogPost.find().sort({ createdAt: -1 });

    const postIds = posts.map((post) => post._id);

    const commentCounts = await blogComment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);

    const commentMap = commentCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const postsWithCommentCount = posts.map((post) => ({
      ...post.toObject(),
      commentCount: commentMap[post._id.toString()] || 0,
    }));

    res.json(postsWithCommentCount);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy bài viết", error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    await blogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    const post = await blogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    const allComments = await blogComment
      .find({ post: post._id })
      .populate("user", "name email")
      .sort({ created_at: -1 });

    const parentComments = allComments.filter((c) => !c.parent);
    const replies = allComments.filter((c) => c.parent);

    const commentsWithReplies = parentComments.map((parent) => {
      const children = replies.filter(
        (r) => r.parent?.toString() === parent._id.toString()
      );
      return {
        ...parent.toObject(),
        replies: children.map((r) => r.toObject()),
      };
    });

    res.json({ post, comments: commentsWithReplies });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy bài viết" });
  }
};

const createPost = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      description,
      readTime,
      date,
      content,
      image,
      type,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Tiêu đề và nội dung là bắt buộc" });
    }

    const newPost = new blogPost({
      title,
      excerpt,
      description,
      readTime,
      date,
      content,
      image,
      type,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Lỗi tạo bài viết" });
  }
};

const updatePost = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      description,
      readTime,
      date,
      content,
      image,
      type,
    } = req.body;

    const updatedPost = await blogPost.findByIdAndUpdate(
      req.params.id,
      {
        title,
        excerpt,
        description,
        readTime,
        date,
        content,
        image,
        type,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy bài viết để cập nhật" });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật bài viết" });
  }
};

const deletePost = async (req, res) => {
  try {
    const deleted = await blogPost.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy bài viết để xoá" });
    }
    res.json({ message: "Đã xoá bài viết thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi xoá bài viết" });
  }
};

const addComment = async (req, res) => {
  try {
    const newComment = new blogComment({
      post: req.params.id,
      user: req.user.id,
      comment: req.body.comment,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Lỗi bình luận" });
  }
};

module.exports = {
  getAllPost,
  getPostById,
  createPost,
  addComment,
  updatePost,
  deletePost,
};
