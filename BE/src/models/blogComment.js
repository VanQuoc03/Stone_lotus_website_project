const mongoose = require("mongoose");

const blogCommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogPost",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogComment",
    default: null,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BlogComment", blogCommentSchema);
