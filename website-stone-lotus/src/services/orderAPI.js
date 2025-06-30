import api from "@/utils/axiosInstance";

export const getMyOrders = async () => {
  const response = await api.get("/api/orders/my");
  return response.data;
};
