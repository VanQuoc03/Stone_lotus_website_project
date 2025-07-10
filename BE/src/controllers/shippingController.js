const { calculateGHNShippingFee } = require("../utils/shipping/ghn");

exports.calculateShippingFeeHandler = async (req, res) => {
  try {
    const { districtCode, wardCode, cartItems } = req.body;

    if (!districtCode || !wardCode || !cartItems?.length) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
    }

    const weight = cartItems.reduce(
      (total, item) => total + item.quantity * 500,
      0
    );

    const fee = await calculateGHNShippingFee({
      fromDistrictId: 1450, // ✅ GHN shop district_id của bạn
      toDistrictId: districtCode,
      toWardCode: wardCode,
      weight,
    });

    res.json({ shippingFee: fee });
  } catch (err) {
    console.error("Lỗi khi tính phí:", err.message);
    res.status(500).json({ message: "Không thể tính phí vận chuyển" });
  }
};
