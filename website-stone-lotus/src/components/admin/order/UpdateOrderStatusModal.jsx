import React, { useState } from "react";
const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao hàng" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];
export default function UpdateOrderStatusModal({
  currentStatus,
  onClose,
  onUpdate,
  orderCode,
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cập nhật trạng thái</h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Cập nhật trạng thái đơn hàng{" "}
          <span className="font-medium text-gray-900">#{orderCode}</span>.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Ghi chú</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thêm ghi chú (nếu cần)"
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onUpdate(selectedStatus, note)}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
