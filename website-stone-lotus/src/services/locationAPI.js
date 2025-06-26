import axios from "axios";

const BASE_URL = "https://provinces.open-api.vn/api";

export const getProvinces = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/p`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy tỉnh/thành phố: ", error);
    throw error;
  }
};
export const getDistrictsByProvince = async (provinceCode) => {
  try {
    const res = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);
    return res.data.districts || [];
  } catch (error) {
    console.error("Lỗi khi lấy quận/huyện:", error);
    throw error;
  }
};

export const getWardsByDistrict = async (districtCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);
    return response.data.wards || [];
  } catch (error) {
    console.error("Lỗi khi lấy phường/xã:", error);
    throw error;
  }
};
