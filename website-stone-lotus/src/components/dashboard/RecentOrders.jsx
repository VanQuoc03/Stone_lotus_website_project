import api from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const statusMap = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800",
  },
  processing: {
    label: "Đang xử lý",
    color: "bg-indigo-100 text-indigo-800",
  },
  shipped: {
    label: "Đã giao hàng",
    color: "bg-cyan-100 text-cyan-800",
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Đã huỷ",
    color: "bg-red-100 text-red-800",
  },
};

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/api/dashboard/orders/recent");
      setOrders(res.data);
    };
    fetchData();
  }, []);
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Đơn hàng gần đây</h2>
        <p className="text-sm text-gray-500">
          Bạn đã nhận được {orders.length} đơn hàng gần đây
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th className="py-2 px-3">Mã đơn</th>
              <th className="py-2 px-3">Khách hàng</th>
              <th className="py-2 px-3">Ngày</th>
              <th className="py-2 px-3">Trạng thái</th>
              <th className="py-2 px-3 text-right">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="py-2 px-3 font-medium text-green-600">
                  {o._id.slice(-6)}
                </td>
                <td className="py-2 px-3">
                  <div className="font-medium">{o.user?.name}</div>
                  <div className="text-gray-500 text-xs">{o.user?.email}</div>
                </td>
                <td className="py-2 px-3">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      statusMap[o.status]?.color || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusMap[o.status]?.label || o.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">
                  {o.total_price.toLocaleString()}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <button className="w-full px-4 py-2 text-gray-600 font-semibold text-sm border hover:bg-gray-200"
        onClick={()=>navigate("/admin/orders")}
        >
          Xem tất cả đơn hàng
        </button>
      </div>
    </div>
  );
}
