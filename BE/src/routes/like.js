const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like");
const { authenticateToken } = require("../utils/authMiddleWare");

router.post("/", authenticateToken, likeController.like);
router.delete("/", authenticateToken, likeController.unlike);
router.get("/count", likeController.getLikeCount);
router.get("/check", authenticateToken, likeController.checkUserLiked);

module.exports = router;
