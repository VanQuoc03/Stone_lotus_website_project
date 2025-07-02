import React, { useState } from "react";
import RecentOrders from "./RecentOrders";
import LowStockProducts from "./LowStockProducts";

export default function RecentAndLowStockTabs() {
  const [activeTab, setActiveTab] = useState("orders");
  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "orders"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Đơn hàng gần đây
        </button>
        <button
          onClick={() => setActiveTab("lowstock")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === "lowstock"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Sản phẩm sắp hết hàng
        </button>
      </div>

      {/* Nội dung từng tab */}
      {activeTab === "orders" && <RecentOrders />}
      {activeTab === "lowstock" && <LowStockProducts />}
    </div>
  );
}
