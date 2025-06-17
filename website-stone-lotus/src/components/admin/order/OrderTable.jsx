import React, { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
export default function OrderTable({
  orders,
  selectedOrders,
  toggleOrderSelection,
  toggleAllOrders,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
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
            <th className="px-4 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="px-4 py-2 font-medium">
                {order.shipping_address?.fullName || "-"}
              </td>
              <td>
                {order.shipping_address?.address || "-"},{" "}
                {order.shipping_address?.district || ""},{" "}
                {order.shipping_address?.province || ""}
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
              <td className="px-4 py-2 relative text-center">
                <button
                  className="p-1 rounded-full hover:bg-gray-100"
                  onClick={() =>
                    setOpenMenuId(openMenuId === order._id ? null : order._id)
                  }
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {openMenuId === order._id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md z-10">
                    <div className="px-4 py-2 text-sm font-semibold">
                      Thao tác
                    </div>
                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      Xem chi tiết
                    </div>
                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      Cập nhật trạng thái
                    </div>
                    <div className="border-t my-1" />
                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      Liên hệ khách hàng
                    </div>
                    <div className="border-t my-1" />
                    <div className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer">
                      Hủy đơn hàng
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
