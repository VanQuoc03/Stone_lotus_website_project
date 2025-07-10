const axios = require("axios");

const GHN_TOKEN = process.env.GHN_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;

const headers = {
  Token: GHN_TOKEN,
  ShopId: GHN_SHOP_ID,
  "Content-Type": "application/json",
};

async function calculateGHNShippingFee({
  fromDistrictId,
  toDistrictId,
  toWardCode,
  weight,
}) {
  try {
    const res = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        from_district_id: Number(fromDistrictId),
        to_district_id: Number(toDistrictId),
        to_ward_code: toWardCode,
        service_type_id: 2,
        weight,
        length: 20,
        width: 15,
        height: 10,
      },
      { headers }
    );
    return res.data?.data?.total || 0;
  } catch (error) {
    console.error("GHN fee API error:", error.response?.data || error.message);
    return 0;
  }
}

module.exports = {
  calculateGHNShippingFee,
};
