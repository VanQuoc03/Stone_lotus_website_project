import React from "react";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function UserInfo({ user }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>

      <div className="flex items-center gap-4">
        <User className="text-blue-600" />
        <div>
          <p className="text-sm text-gray-500">Họ và tên</p>
          <p className="font-medium">{user.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Mail className="text-blue-600" />
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Shield className="text-blue-600" />
        <div>
          <p className="text-sm text-gray-500">Vai trò</p>
          <p className="font-medium capitalize">{user.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Calendar className="text-blue-600" />
        <div>
          <p className="text-sm text-gray-500">Ngày tham gia</p>
          <p className="font-medium">{formatDate(user.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
