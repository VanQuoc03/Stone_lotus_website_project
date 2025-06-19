import React, { useState } from "react";

export default function CancelOrderModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-bold text-red-600">
          Xác nhận hủy đơn hàng
        </h2>
        <p className="text-sm text-gray-600">
          Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn
          tác.
        </p>

        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Nhập lý do hủy đơn hàng..."
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={() => onConfirm(reason)}
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
}
