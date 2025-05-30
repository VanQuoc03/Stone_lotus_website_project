import api from "@/utils/axiosInstance";

export const getUser = async (page = 1, limit = 10) => {
  const res = await api.get(`/api/users?page=${page}&limit=${limit}`, {
    params: { page, limit },
  });
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/api/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/api/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/api/users/${id}`);
  return true;
};

export const bulkDeleteUsers = async (ids) => {
  const res = await api.post("/api/bulk-delete", { ids });
  return res.data;
};

export const bulkUpdateUserStatus = async (ids, data) => {
  const res = await api.patch("/api/bulk-status", { ids, data });
  return res.data;
};
