// @/services/productService.js
import api from "@/utils/axiosInstance";

export const fetchProducts = async ({ search, category, page, limit }) => {
  const res = await api.get("/api/products", {
    params: {
      search: search || undefined,
      category: category !== "all" ? category : undefined,
      page,
      limit,
      includeInactive: true,
    },
  });
  return res.data;
};

export const fetchCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data;
};

export const addProduct = async (product) => {
  const res = await api.post("/api/products", product);
  return res.data;
};

export const updateProduct = async (product) => {
  const res = await api.put(`/api/products/${product._id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/api/products/${id}`);
};

export const bulkDeleteProducts = async (ids) => {
  await api.post("/api/products/bulk-delete", { ids });
};

export const bulkUpdateProductStatus = async (ids, status) => {
  await api.patch("/api/products/bulk-status", { ids, status });
};

export const toggleProductStatus = async (id, status) => {
  const res = await api.patch(`/api/products/${id}/status`, { status });
  return res.data;
};

export const updateProductStock = async (id, quantity) => {
  await api.put(`/api/inventory/${id}`, { quantity });
};
