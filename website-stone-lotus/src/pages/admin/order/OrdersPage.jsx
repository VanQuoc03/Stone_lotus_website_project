import React, { useEffect, useState } from "react";
import { Download, Search, Calendar } from "lucide-react";
import api from "@/utils/axiosInstance";
import Pagination from "@/components/admin/customer/Pagination";
import OrderTable from "@/components/admin/order/OrderTable";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng: ", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Đơn hàng</h1>
        <button className="flex items-center border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100">
          <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </button>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm kiếm đơn hàng..."
            className="w-full pl-8 pr-3 py-2 border rounded text-sm"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-3 py-2 text-sm text-gray-700"
            // value={statusFilter}
            // onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <div className="relative">
            <button className="flex items-center border px-3 py-2 rounded hover:bg-gray-100 text-sm">
              <Calendar className="mr-2 h-4 w-4" /> Khoảng thời gian
            </button>
            {/* Có thể làm dropdown menu đơn giản ở đây sau nếu cần */}
          </div>
        </div>
      </div>
      <OrderTable orders={filteredOrders} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
