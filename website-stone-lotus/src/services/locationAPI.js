import axios from "axios";

const GHN_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;
const GHN_SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;

const headers = {
  Token: GHN_TOKEN,
  ShopId: GHN_SHOP_ID,
  "Content-Type": "application/json",
};

export const getShopInfo = async () => {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shop/all",
      {
        headers: {
          Token: import.meta.env.VITE_GHN_TOKEN,
        },
      }
    );

    const shops = res.data?.data?.shops || [];

    if (shops.length === 0) {
      return null;
    }

    const shop = shops[0];
    return shop;
  } catch (error) {
    console.error(
      error.response?.data || error.message
    );
    return null;
  }
};

export const getProvinces = async () => {
  try {
    const res = await axios.get(`${GHN_BASE_URL}/master-data/province`, {
      headers,
    });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy tỉnh/thành phố: ", error);
    throw error;
  }
};
export const getDistrictsByProvince = async (provinceId) => {
  try {
    const res = await axios.post(
      `${GHN_BASE_URL}/master-data/district`,
      {
        province_id: Number(provinceId),
      },
      { headers }
    );
    return res.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy quận/huyện:", error);
    throw error;
  }
};

export const getWardsByDistrict = async (districtId) => {
  try {
    const response = await axios.post(
      `${GHN_BASE_URL}/master-data/ward`,
      {
        district_id: Number(districtId),
      },
      {
        headers,
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi lấy phường/xã:", error);
    throw error;
  }
};

export const calculateShippingFee = async ({
  fromDistrictId,
  toDistrictId,
  toWardCode,
  weight,
  length = 20,
  width = 15,
  height = 10,
}) => {
  try {
    const res = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        from_district_id: Number(fromDistrictId),
        to_district_id: Number(toDistrictId),
        to_ward_code: toWardCode,
        service_type_id: 2,
        weight,
        length,
        width,
        height,
      },
      {
        headers: {
          Token: import.meta.env.VITE_GHN_TOKEN,
          ShopId: import.meta.env.VITE_GHN_SHOP_ID,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.data.total;
  } catch (error) {
    console.error("Tính phí GHN lỗi:", error);
    return 0;
  }
};
