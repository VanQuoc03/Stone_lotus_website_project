import api from "@/utils/axiosInstance";

const BASE_URL = "/api/products";

export const fetchProducts = (params) => {
  return api.get(BASE_URL, { params });
};

export const fetchProductById = (id) => {
  return api.get(`${BASE_URL}/${id}`);
};

export const fetchRelatedProducts = (categoryId, excludeId, limit = 10) => {
  return api.get(`${BASE_URL}/related`, {
    params: {
      category: categoryId,
      exclude: excludeId,
      limit,
    },
  });
};
