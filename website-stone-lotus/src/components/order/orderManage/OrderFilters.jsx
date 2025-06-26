import React from "react";
import { Search, Filter } from "lucide-react";
export default function OrderFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  statusCounts,
}) {
  return (
    <div className="bg-white shadow rounded mb-6 p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-48 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả ({statusCounts.all})</option>
            <option value="processing">
              Đang xử lý ({statusCounts.processing})
            </option>
            <option value="shipping">
              Đang giao ({statusCounts.shipping})
            </option>
            <option value="delivered">
              Đã giao ({statusCounts.delivered})
            </option>
            <option value="cancelled">Đã hủy ({statusCounts.cancelled})</option>
          </select>
          <Filter className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
