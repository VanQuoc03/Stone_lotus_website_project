const express = require("express");
const router = express.Router();

const {
  getBestSellingProducts,
} = require("../controllers/bestSellingController");

router.get("/best-selling", getBestSellingProducts);

module.exports = router;
