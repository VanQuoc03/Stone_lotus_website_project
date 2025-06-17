// src/utils/axiosInstance.js
import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }), // ✅ Sửa lỗi ở đây
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ");
    }
    return Promise.reject(err);
  }
);

export default api;
