import api from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LowStockProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLowStock = async () => {
      const res = await api.get("/api/dashboard/inventory/low-stock");
      console.log("Sắp hết hàng: ", res.data);
      setProducts(res.data);
    };
    fetchLowStock();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Sản phẩm sắp hết hàng</h2>
        <p className="text-sm text-gray-500">
          {products.length} sản phẩm cần được nhập thêm
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th className="py-2 px-3">Hình ảnh</th>
              <th className="py-2 px-3">Tên sản phẩm</th>
              <th className="py-2 px-3">Danh mục</th>
              <th className="py-2 px-3">Số lượng</th>
              <th className="py-2 px-3">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2 px-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded"></div>
                  )}
                </td>
                <td className="py-2 px-3 font-medium">{p.name}</td>
                <td className="py-2 px-3">{p.category}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      p.needRestock
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {p.quantity} {p.needRestock ? "Cần nhập" : ""}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {new Date(p.updatedAt).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-center mt-4 ">
          <button
            className="w-full px-4 py-2 text-gray-600 font-semibold text-sm border hover:bg-gray-200"
            onClick={() => navigate(`/inventory`)}
          >
            Quản lý kho hàng
          </button>
        </div>
      </div>
    </div>
  );
}
