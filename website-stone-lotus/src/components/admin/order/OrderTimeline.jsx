import dayjs from "dayjs";
import {
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";

const FULL_STEPS = [
  {
    status: "pending",
    label: "Đơn hàng được tạo",
    note: "Đơn hàng đã được tạo và chờ xác nhận",
  },
  {
    status: "confirmed",
    label: "Đã xác nhận",
    note: "Đơn hàng đã được xác nhận và chuẩn bị đóng gói",
  },
  {
    status: "processing",
    label: "Đang xử lý",
    note: "Đơn hàng đang được đóng gói",
  },
  {
    status: "shipped",
    label: "Đang giao hàng",
    note: "Đơn hàng đã được giao cho đơn vị vận chuyển",
  },
  {
    status: "completed",
    label: "Đã giao hàng",
    note: "Đơn hàng đã được giao thành công",
  },
];

const getStatusIcon = (status, completed) => {
  if (completed) return <CheckCircle className="text-green-500 w-5 h-5" />;
  if (status === "shipped")
    return <Truck className="text-purple-500 w-5 h-5" />;
  if (status === "processing")
    return <PackageCheck className="text-blue-500 w-5 h-5" />;
  if (status === "pending")
    return <Clock className="text-yellow-500 w-5 h-5" />;
  return <AlertCircle className="text-gray-400 w-5 h-5" />;
};

const generateOrderSteps = (timeline = []) => {
  const completedStatuses = timeline.map((t) => t.status);
  const timeMap = timeline.reduce((acc, t) => {
    acc[t.status] = t.timestamp;
    return acc;
  }, {});

  // Kiểm tra xem đơn hàng có bị hủy không
  const hasBeenCancelled = completedStatuses.includes("cancelled");
  const cancelledInfo = timeline.find((t) => t.status === "cancelled");

  if (hasBeenCancelled) {
    // Tìm trạng thái cuối cùng đã hoàn thành trước khi hủy (loại trừ cancelled)
    const completedStatusesExceptCancelled = completedStatuses.filter(
      (status) => status !== "cancelled"
    );
    const lastCompletedIndex = FULL_STEPS.findIndex((step, index) => {
      // Tìm index của step cuối cùng đã completed
      for (let i = FULL_STEPS.length - 1; i >= 0; i--) {
        if (completedStatusesExceptCancelled.includes(FULL_STEPS[i].status)) {
          return i === index;
        }
      }
      return false;
    });

    // Nếu không có step nào completed trước khi cancel, chỉ hiển thị step đầu tiên
    const stepsToShow =
      lastCompletedIndex >= 0
        ? FULL_STEPS.slice(0, lastCompletedIndex + 1)
        : [FULL_STEPS[0]];

    return {
      steps: stepsToShow.map((step) => ({
        ...step,
        completed: completedStatusesExceptCancelled.includes(step.status),
        timestamp: timeMap[step.status] || null,
      })),
      cancelledInfo,
    };
  }

  // Nếu không bị hủy, hiển thị tất cả steps như bình thường
  return {
    steps: FULL_STEPS.map((step) => ({
      ...step,
      completed: completedStatuses.includes(step.status),
      timestamp: timeMap[step.status] || null,
    })),
    cancelledInfo: null,
  };
};

export default function OrderTimeline({ timeline = [] }) {
  const { steps, cancelledInfo } = generateOrderSteps(timeline);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">🕒 Lịch sử đơn hàng</h2>

      <div className="space-y-6 border-t">
        {steps.map((step, index) => (
          <div className="flex items-start gap-4 mt-2" key={index}>
            <div className="pt-1">
              {getStatusIcon(step.status, step.completed)}
            </div>
            <div
              className={`${
                step.completed ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <p className="font-medium">{step.label}</p>
              <p className="text-sm">{step.note}</p>
              {step.timestamp && (
                <p className="text-xs text-gray-500">
                  {dayjs(step.timestamp).format("DD/MM/YYYY HH:mm")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Thông báo hủy đơn hàng nếu có */}
      {cancelledInfo && (
        <div className="mb-4 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500 w-5 h-5" />
            <div>
              <p className="font-medium text-red-700">Đơn hàng đã bị hủy</p>
              <p className="text-sm text-red-600">
                Đơn hàng bị hủy theo yêu cầu
              </p>
              {cancelledInfo.timestamp && (
                <p className="text-xs text-red-500">
                  {dayjs(cancelledInfo.timestamp).format("DD/MM/YYYY HH:mm")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
