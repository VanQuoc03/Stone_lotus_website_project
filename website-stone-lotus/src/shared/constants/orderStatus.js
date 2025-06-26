// Danh sách trạng thái hợp lệ
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipping",
  "completed",
  "cancelled",
];

// Label tiếng Việt hiển thị cho người dùng
export const ORDER_STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  completed: "Đã giao hàng",
  cancelled: "Đã hủy",
};

// Biểu tượng tương ứng (tuỳ bạn chọn thêm/thay đổi)
export const ORDER_STATUS_ICONS = {
  pending: "🕓",
  confirmed: "✔️",
  processing: "📦",
  shipping: "🚚",
  completed: "✅",
  cancelled: "❌",
};

// Màu hiển thị (CSS class hoặc mã hex)
export const ORDER_STATUS_COLORS = {
  pending: "text-gray-500",
  confirmed: "text-yellow-500",
  processing: "text-blue-500",
  shipping: "text-purple-500",
  completed: "text-green-600",
  cancelled: "text-red-500",
};

// Dropdown option cho select
export const STATUS_OPTIONS = ORDER_STATUSES.map((status) => ({
  value: status,
  label: ORDER_STATUS_LABELS[status],
}));

// Hàm tiện ích
export function getOrderStatusMeta(status) {
  return {
    label: ORDER_STATUS_LABELS[status] || status,
    icon: ORDER_STATUS_ICONS[status] || "❓",
    color: ORDER_STATUS_COLORS[status] || "text-gray-500",
  };
}
