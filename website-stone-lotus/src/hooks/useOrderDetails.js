import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function useOrderDetails(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderById = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(res.data);
      } catch (error) {
        setError("Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderById();
  }, [orderId]);

  const updateStatus = async (newStatus, note) => {
    try {
      const res = await api.patch(
        `/api/orders/${orderId}/status`,
        { status: newStatus, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder((prev) => ({
        ...res.data,
        orderId: prev.orderId || orderId,
        id: prev.id || orderId,
      }));
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      throw err;
    }
  };

  const cancelOrder = async (reason) => {
    try {
      const res = await api.patch(
        `/api/orders/${orderId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(res.data);
    } catch (err) {
      console.error("Lỗi khi hủy đơn:", err);
      throw err;
    }
  };

  return {
    order,
    loading,
    error,
    updateStatus,
    cancelOrder,
  };
}
