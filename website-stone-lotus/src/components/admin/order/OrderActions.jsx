import React, { useState } from "react";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import CancelOrderModal from "./CancelOrderModal";
import { FileText, Mail } from "lucide-react";
import dayjs from "dayjs";

export default function OrderActions({
  orderCode,
  onPrint,
  onEmail,
  onOrderCancel,
  onStatusUpdate,
  isCancelled,
  cancelledAt,
  currentStatus,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  return (
    <div className="bg-white rounded-md shadow p-4 space-y-4">
      <h2 className="text-2xl font-bold">Thao tác</h2>

      {!isCancelled ? (
        <>
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
              onClick={() => setCancelModalOpen(true)}
            >
              Hủy đơn hàng
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            className="w-full py-2 px-4 border border-gray-300 flex items-center justify-center gap-2 rounded hover:bg-gray-100 transition"
            onClick={() => alert("Tải báo cáo hủy")}
          >
            <FileText size={16} />
            Xuất báo cáo hủy
          </button>

          <button
            className="w-full py-2 px-4 border border-gray-300 flex items-center justify-center gap-2 rounded hover:bg-gray-100 transition"
            onClick={onEmail}
          >
            <Mail size={16} />
            Gửi email thông báo
          </button>

          <p className="text-center text-gray-500 italic text-sm border-t pt-3">
            Đơn hàng đã bị hủy vào{" "}
            <strong>{dayjs(cancelledAt).format("DD/MM/YYYY HH:mm")}</strong>
          </p>
        </>
      )}

      {modalOpen && (
        <UpdateOrderStatusModal
          orderCode={orderCode}
          currentStatus={currentStatus}
          onClose={() => setModalOpen(false)}
          onUpdate={(status, note) => {
            onStatusUpdate(status, note);
            setModalOpen(false);
          }}
        />
      )}
      {cancelModalOpen && (
        <CancelOrderModal
          onClose={() => setCancelModalOpen(false)}
          onConfirm={(reason) => {
            onOrderCancel(reason);
            setCancelModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
