const express = require('express');

const router = express.Router();
const { calculateShippingFeeHandler } = require('../controllers/shippingController');

router.post("/calculate-fee", calculateShippingFeeHandler);

module.exports = router;