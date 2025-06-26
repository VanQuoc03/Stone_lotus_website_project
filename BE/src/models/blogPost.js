const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  description: { type: String },
  readTime: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  type: { type: String },
  views: {
    type: Number,
    default: 0,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
