import api from "@/utils/axiosInstance";
// import axios from "axios";
const BASE_URL = "/api/categories";

export const fetchCategories = async () => {
  const res = await api.get(BASE_URL);
  return res.data;
};
