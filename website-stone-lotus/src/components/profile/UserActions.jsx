import React from "react";
import { Edit, Key, Activity } from "lucide-react";

export default function UserActions({ onEdit }) {
  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold">Tài khoản</h2>

      <button
        className="w-full flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" /> Chỉnh sửa thông tin cá nhân
      </button>

      <button className="w-full flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50">
        <Key className="h-4 w-4" /> Thay đổi mật khẩu
      </button>

      <button className="w-full flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50">
        <Activity className="h-4 w-4" /> Lịch sử hoạt động
      </button>
    </div>
  );
}
