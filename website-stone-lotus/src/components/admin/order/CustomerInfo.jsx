// CustomerInfo.jsx - Thông tin khách hàng trong đơn hàng (phiên bản giao diện mới)
import { Mail, Phone, User } from "lucide-react";
import React from "react";

export default function CustomerInfo({ customer }) {
  if (!customer) return null;

  return (
    <div className="bg-white rounded-md shadow p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-5 w-5" />

        <div className="text-2xl font-bold">Thông tin khách hàng</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 mt-4 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium">
          {customer.fullName?.charAt(0).toUpperCase() || "K"}
        </div>
        <div>
          <p className="font-medium text-gray-900">{customer.fullName}</p>
          <p className="text-sm text-gray-500">Khách hàng</p>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5" />

          <span>{customer.phone || "Không có số điện thoại"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />

          <span>{customer.email || "Không có email"}</span>
        </div>
      </div>
      <button className="mt-4 w-full font-semibold border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition">
        Liên hệ khách hàng
      </button>
    </div>
  );
}
