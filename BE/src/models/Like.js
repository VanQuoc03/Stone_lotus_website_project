const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetType: {
    type: String,
    enum: ["BlogPost", "BlogComment"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

likeSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);
