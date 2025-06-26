const express = require("express");
const router = express.Router();

const blog = require("../controllers/blog");
const blogComment = require("../controllers/blogComment");

const { authenticateToken } = require("../utils/authMiddleWare");
const { requireRole } = require("../utils/roleMiddleware");

router.get("/posts", blog.getAllPost);
router.get("/posts/:id", blog.getPostById);
router.post("/posts", authenticateToken, requireRole("admin"), blog.createPost);
router.post("/posts/:id/comments", authenticateToken, blog.addComment);
router.put(
  "/posts/:id",
  authenticateToken,
  requireRole("admin"),
  blog.updatePost
);
router.delete(
  "/posts/:id",
  authenticateToken,
  requireRole("admin"),
  blog.deletePost
);

//Comment blog
router.get("/comments/:postId", blogComment.getCommentByPost);

router.post("/comments/:postId", authenticateToken, blogComment.addComment);

router.post(
  "/comments/:commentId/reply",
  authenticateToken,
  blogComment.replyToComment
);

module.exports = router;
