// Danh sách trạng thái hợp lệ
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

// Label tiếng Việt hiển thị cho người dùng
const ORDER_STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  completed: "Đã giao hàng",
  cancelled: "Đã hủy",
};

// Biểu tượng tương ứng (tuỳ bạn chọn thêm/thay đổi)
const ORDER_STATUS_ICONS = {
  pending: "🕓",
  confirmed: "✔️",
  processing: "📦", // hoặc `Box`
  shipped: "🚚", // hoặc `Truck`
  completed: "✅", // hoặc `CheckCircle`
  cancelled: "❌", // hoặc `XCircle`
};

// Màu hiển thị (CSS class hoặc mã hex)
const ORDER_STATUS_COLORS = {
  pending: "text-gray-500",
  processing: "text-blue-500",
  shipped: "text-purple-500",
  completed: "text-green-600",
  cancelled: "text-red-500",
};

// Dropdown option cho select
const STATUS_OPTIONS = ORDER_STATUSES.map((status) => ({
  value: status,
  label: ORDER_STATUS_LABELS[status],
}));

module.exports = {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_ICONS,
  ORDER_STATUS_COLORS,
  STATUS_OPTIONS,
};
