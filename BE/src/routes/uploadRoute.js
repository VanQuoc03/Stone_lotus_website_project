const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const router = express.Router();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedTypes.test(file.mimetype);
  if (extname && mime) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Chỉ cho phép các tệp hình ảnh với định dạng: jpg, jpeg, png, webp, gif"
      )
    );
  }
};

const upload = multer({
  dest: "uploads/",
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/multiple", upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Không có tệp nào được tải lên" });
    }
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "products",
      })
    );
    // Chờ tất cả các tệp được upload lên Cloudinary
    const results = await Promise.all(uploadPromises);
    // Xóa các tệp tạm thời sau khi upload thành công
    req.files.forEach((file) => fs.unlinkSync(file.path));
    // Trả về các URL của hình ảnh đã upload
    const imageUrls = results.map((r) => r.secure_url);
    res.json({ imageUrls });
  } catch (error) {
    console.error("Lỗi upload:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
