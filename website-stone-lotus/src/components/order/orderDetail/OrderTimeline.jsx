import React from "react";
import { Clock, CheckCircle, Truck, PackageCheck, XCircle } from "lucide-react";
import clsx from "clsx";
const STATUS_STEPS = [
  { key: "pending", label: "Chờ xác nhận", icon: Clock },
  { key: "confirmed", label: "Đã xác nhận", icon: CheckCircle },
  { key: "processing", label: "Đang xử lý", icon: PackageCheck },
  { key: "shipped", label: "Đang giao hàng", icon: Truck },
  { key: "completed", label: "Đã giao hàng", icon: CheckCircle },
];

export default function OrderTimeline({ status, timeline = [], cancelledAt }) {
  const currentIndex = STATUS_STEPS.findIndex((step) => step.key === status);
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Tiến trình đơn hàng</h2>
      <div className="relative border-l border-gray-200 pl-6">
        {STATUS_STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          const Icon = step.icon;
          const timeLog = timeline.find((t) => t.status === step.key);
          return (
            <div key={step.key} className="mb-6 relative">
              <span
                className={clsx(
                  "absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center",
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-white"
                )}
              >
                <Icon className="w-4 h-4" />
              </span>
              <p
                className={clsx(
                  "text-sm font-medium",
                  isActive ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.label}
              </p>
              {timeLog && (
                <p className="text-xs text-gray-500">
                  {new Date(timeLog.timestamp).toLocaleString("vi-VN")}
                </p>
              )}
            </div>
          );
        })}

        {status === "cancelled" && (
          <div className="relative">
            <span className="absolute -left-3 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </span>
            <p className="text-sm font-medium text-red-600">Đã hủy</p>
            {cancelledAt && (
              <p className="text-xs text-gray-500">
                {new Date(cancelledAt).toLocaleString("vi-VN")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
