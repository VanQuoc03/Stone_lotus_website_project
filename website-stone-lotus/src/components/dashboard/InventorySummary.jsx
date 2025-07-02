import api from "@/utils/axiosInstance";
import { AlertTriangle, Package, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function InventorySummary() {
  const [data, setData] = useState({
    total: 0,
    lowStock: 0,
    newlyAdded: 0,
  });

  useEffect(() => {
    const fetchInventorySummary = async () => {
      try {
        const res = await api.get("/api/dashboard/inventory/summary");
        setData(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thống kê kho hàng", err);
      }
    };
    fetchInventorySummary();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-2">Tình trạng kho hàng</h2>
      <p className="text-sm text-gray-500 mb-4">
        Tổng quan về tình trạng kho hàng
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 flex items-center gap-4">
          <Package className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Tổng sản phẩm</p>
            <p className="text-xl font-bold">{data.total}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex items-center gap-4">
          <AlertTriangle className="text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Sắp hết hàng</p>
            <p className="text-xl font-bold">
              {data.lowStock}{" "}
              <span className="text-lg font-semibold">sản phẩm</span>
            </p>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex items-center gap-4">
          <PlusCircle className="text-emerald-500" />
          <div>
            <p className="text-sm text-gray-500">Mới nhập</p>
            <p className="text-xl font-bold">
              {data.newlyAdded}{" "}
              <span className="text-lg font-semibold">sản phẩm</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
