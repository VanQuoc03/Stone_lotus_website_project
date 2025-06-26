// hooks/useOrders.js
import { useEffect, useState, useCallback } from "react";
import api from "@/utils/axiosInstance";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(Array.isArray(data.orders) ? data.orders : data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
  };
}
