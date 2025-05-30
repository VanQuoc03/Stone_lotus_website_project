const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });
    fs.unlinkSync(req.file.path);
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Lỗi upload:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
