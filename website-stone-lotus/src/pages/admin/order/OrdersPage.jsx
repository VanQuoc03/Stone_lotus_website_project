import React, { useEffect, useState, useCallback } from "react";
import { Download, Search } from "lucide-react";
import api from "@/utils/axiosInstance";
import useDebounce from "@/hooks/useDebounce";

import Pagination from "@/components/admin/customer/Pagination";
import OrderTable from "@/components/admin/order/OrderTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ORDER_STATUSES = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchOrders = useCallback(async (page, status, search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        status,
        search,
        sort: "createdAt_desc",
      });
      const res = await api.get(`/api/orders?${params.toString()}`);
      setOrders(res.data.orders);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalOrders: res.data.totalOrders,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng: ", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(pagination.currentPage, filters.status, debouncedSearch);
  }, [pagination.currentPage, filters.status, debouncedSearch, fetchOrders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to page 1 when filters change
    if (name !== "search") {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Đơn hàng</h1>
          <p className="text-sm text-gray-500">
            Quản lý và theo dõi tất cả đơn hàng của khách.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => alert("Chức năng xuất Excel chưa được triển khai")}
        >
          <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            name="search"
            placeholder="Tìm theo ID, tên, SĐT..."
            className="w-full pl-8"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <OrderTable orders={orders} isLoading={loading} />

      {!loading && orders.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
