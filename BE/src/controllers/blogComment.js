const BlogComment = require("../models/blogComment");
const BlogPost = require("../models/blogPost");

exports.getCommentByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const parentComments = await BlogComment.find({ post: postId })
      .populate("user", "name email")
      .sort({ created_at: -1 });

    const commentsWithReplies = await Promise.all(
      parentComments.map(async (comment) => {
        const replies = await BlogComment.find({ parent: comment._id })
          .populate("user", "name email")
          .sort({ created_at: 1 });
        return {
          ...comment.toObject(),
          replies,
        };
      })
    );
    res.json(commentsWithReplies);
  } catch (error) {
    console.error("Lỗi khi nhận bình luận: ", error);
    res.status(500).json({ error: "Lỗi server khi lấy bình luận" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment, parent } = req.body;
    const userId = req.user._id || req.user.id;

    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Bài viết không tồn tại" });

    if (parent) {
      const parentComment = await BlogComment.findById(parent);
      if (!parentComment) {
        return res.status(400).json({ error: "Bình luận cha không tồn tại" });
      }
      if (parentComment.parent) {
        return res.status(400).json({ eror: "Chỉ cho phép phản hồi 1 cấp!" });
      }
    }

    const newComment = new BlogComment({
      post: postId,
      user: userId,
      comment,
      parent: parent || null,
    });
    await newComment.save();

    const populatedComment = await BlogComment.findById(
      newComment._id
    ).populate("user", "name email");
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Lỗi khi thêm bình luận", error);
    res.status(500).json({ error: "Lỗi server khi thêm bình luận" });
  }
};

exports.replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  try {
    const parent = await BlogComment.findById(commentId);
    if (!parent)
      return res.status(404).json({ message: "Không tìm thấy bình luận" });

    const reply = await BlogComment.create({
      user: userId,
      post: parent.post,
      comment,
      parent: commentId,
    });

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: "Lỗi phản hồi", error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await BlogComment.findByIdAndDelete(commentId);

    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy bình luận" });
    }

    await BlogComment.deleteMany({ parent: commentId });

    res.json({ message: "Đã xóa bình luận thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi xóa bình luận" });
  }
};
