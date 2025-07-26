import { useState, useEffect } from "react";
import PromotionManager from "@/components/admin/promotions/PromotionManager";
import api from "@/utils/axiosInstance";

export default function Promotions() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/api/admin/promotions");
        setCoupons(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCreate = async (formData) => {
    const res = await api.post("/api/admin/promotions", formData);
    setCoupons((prev) => [res.data, ...prev]);
  };

  const handleUpdate = async (id, formData) => {
    const res = await api.put(`/api/admin/promotions/${id}`, formData);
    setCoupons((prev) =>
      prev.map((coupon) => (coupon._id === id ? res.data : coupon))
    );
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/admin/promotions/${id}`);
    setCoupons((prev) => prev.filter((c) => c._id !== id));
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/api/admin/promotions/${id}/status`);
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: res.data.status } : coupons
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  return (
    <PromotionManager
      coupons={coupons}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
      loading={loading}
    />
  );
}
