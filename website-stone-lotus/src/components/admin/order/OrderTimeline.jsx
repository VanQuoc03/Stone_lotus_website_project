import React from "react";
import dayjs from "dayjs";
import {
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
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

  return FULL_STEPS.map((step) => ({
    ...step,
    completed: completedStatuses.includes(step.status),
    timestamp: timeMap[step.status] || null,
  }));
};

export default function OrderTimeline({ timeline = [] }) {
  const steps = generateOrderSteps(timeline);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">🕒 Lịch sử đơn hàng</h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div className="flex items-start gap-4" key={index}>
            <div className="pt-1">
              {getStatusIcon(step.status, step.completed)}
            </div>
            <div className={step.completed ? "text-gray-900" : "text-gray-400"}>
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
    </div>
  );
}
