// src/components/order/OrderStatusBox.jsx
import { getOrderStatusMeta } from "@/shared/constants/orderStatus";
import { Clock } from "lucide-react";

export default function OrderStatusBox({ status, createdAt, timeline = [] }) {
  const { label, icon, color } = getOrderStatusMeta(status);
  const createdTime = new Date(createdAt).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const latestNote = timeline.find((item) => item.status === status)?.note;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5" />
        Trạng thái đơn hàng
      </h2>

      <div className="mb-2 flex items-center gap-3">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full border ${color} bg-opacity-10 border-opacity-30`}
        >
          {icon} {label}
        </span>
        <span className="text-sm text-gray-500">{createdTime}</span>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        {latestNote || "Đơn hàng đang được xử lý."}
      </p>

      {status === "pending" && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-4 rounded-lg space-y-1">
          <p>• Đơn hàng của bạn đã được tiếp nhận thành công</p>
          <p>• Chúng tôi sẽ xác nhận đơn hàng trong vòng 30 phút</p>
          <p>• Bạn sẽ nhận được thông báo qua email</p>
          <p>• Có thể hủy đơn hàng trước khi được xác nhận</p>
        </div>
      )}

      {status === "cancelled" && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-4 rounded-lg space-y-1">
          <p>• Đơn hàng đã bị hủy</p>
          <p>• Vui lòng liên hệ hỗ trợ nếu có bất kỳ thắc mắc nào</p>
        </div>
      )}
    </div>
  );
}
