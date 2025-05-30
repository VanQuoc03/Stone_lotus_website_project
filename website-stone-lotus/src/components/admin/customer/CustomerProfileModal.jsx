import React from "react";

export default function CustomerProfileModal({ open, onClose, customer }) {
  if (!open || !customer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h1 className="text-xl font-semibold mb-4">Thông tin khách hàng</h1>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Họ tên:</strong> {customer.name}
          </div>
          <div>
            <strong>Email:</strong> {customer.email}
          </div>
          <div>
            <strong>Trạng thái:</strong>{" "}
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                customer.status
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {customer.status ? "Đang hoạt động" : "Không hoạt động"}
            </span>
          </div>
          <div>
            <strong>Tổng chi tiêu:</strong>{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
            }).format(customer.total_spent || 0)}
          </div>
          <div>
            <strong>Ngày đăng ký:</strong>{" "}
            {new Date(customer.created_at).toLocaleDateString("vi-VN")}
          </div>
        </div>
      </div>
    </div>
  );
}
