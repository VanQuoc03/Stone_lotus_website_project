import React, { useState } from "react";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";

export default function OrderActions({
  orderCode,
  onPrint,
  onEmail,
  onCancel,
  onStatusUpdate,
  currentStatus,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="bg-white rounded-md shadow p-4 space-y-4">
      <h2 className="text-2xl font-bold">Thao tác</h2>

      <button
        className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition"
        onClick={() => setModalOpen(true)}
      >
        Cập nhật trạng thái
      </button>

      <button
        className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition"
        onClick={onPrint}
      >
        In hóa đơn
      </button>

      <button
        className="w-full py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition"
        onClick={onEmail}
      >
        Gửi email khách hàng
      </button>

      <div className="border-t pt-3">
        <button
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={onCancel}
        >
          Hủy đơn hàng
        </button>
      </div>
      {modalOpen && (
        <UpdateOrderStatusModal
          orderCode={orderCode}
          currentStatus={currentStatus}
          onClose={() => setModalOpen(false)}
          onUpdate={(status) => {
            onStatusUpdate(status);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
