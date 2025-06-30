import React, { useState } from "react";
import useOrders from "@/hooks/useOrders";
import OrderFilters from "@/components/order/orderManage/OrderFilters";
import OrderTabs from "@/components/order/orderManage/OrderTabs";
import OrderCard from "@/components/order/orderManage/OrderCard";

export default function OrderManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { orders, loading, error, refresh } = useOrders();
  console.log(orders);
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className=" max-w-7xl mx-auto min-h-screen bg-gray-50 mt-[200px]">
      <div className="bg-white border-b px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-1">
          Theo dõi và quản lý tất cả đơn hàng của bạn
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <OrderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusCounts={statusCounts}
        />
        <OrderTabs
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusCounts={statusCounts}
        />
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Đang tải đơn hàng...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center shadow rounded">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}
