const express = require("express");
const router = express.Router();
const { getFeaturedItems } = require("../controllers/featuredController");

router.get("/featured", getFeaturedItems);

module.exports = router;
