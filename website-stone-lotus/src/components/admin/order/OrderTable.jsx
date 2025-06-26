import React, { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function OrderTable({
  orders,
  selectedOrders,
  toggleOrderSelection,
  toggleAllOrders,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="rounded-md border overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">
              <input type="checkbox" />
            </th>
            <th className="px-4 py-2 text-left">Người nhận</th>
            <th className="px-4 py-2 text-left">Địa chỉ</th>
            <th className="px-4 py-2 text-left">Tổng tiền</th>
            <th className="px-4 py-2 text-left">Thanh toán</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
            <th className="px-4 py-2 text-left">Ngày tạo</th>
            <th className="px-4 py-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-center">
                <input type="checkbox" />
              </td>
              <td className="px-4 py-2 font-medium">
                {order.shipping_address?.fullName || "-"}
              </td>
              <td>
                {[
                  order.shipping_address?.address,
                  order.shipping_address?.ward,
                  order.shipping_address?.district,
                  order.shipping_address?.city,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </td>
              <td className="px-4 py-2">
                {order.total_price?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }) || "0₫"}
              </td>
              <td className="px-4 py-2 capitalize">{order.payment_method}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status === "completed"
                    ? "Hoàn thành"
                    : order.status === "pending"
                    ? "Chờ xác nhận"
                    : order.status === "processing"
                    ? "Đang xử lý"
                    : order.status === "shipped"
                    ? "Đang giao"
                    : order.status === "cancelled"
                    ? "Đã hủy"
                    : order.status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
              </td>
              <td className="px-4 py-2 text-sm text-gray-500">
                <button
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="bg-green-600 px-4 py-2 text-white rounded"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
