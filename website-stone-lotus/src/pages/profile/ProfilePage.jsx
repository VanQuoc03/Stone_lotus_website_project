import React, { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import {
  User,
  Mail,
  Shield,
  Activity,
  Edit,
  Key,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import SetPasswordForm from "@/components/profile/SetPasswordForm";
import PurchaseHistoryModal from "@/components/profile/PurchaseHistoryModal";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/users/me");
      console.log("Dữ liệu người dùng:", res.data);
      setUser(res.data);
    } catch (error) {
      console.error("Không thể tải thông tin người dùng", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const joinDate = user?.created_at
    ? formatDate(user.created_at)
    : "Không có thông tin";

  if (loading)
    return <div className="p-6 mt-[100px]">Đang tải thông tin...</div>;

  if (!user) {
    return (
      <div className="p-6 mt-[100px] text-center text-red-600">
        Không thể tải thông tin người dùng.
        <button
          onClick={fetchUser}
          className="mt-4 px-4 py-2 border rounded border-red-400 text-red-600 hover:bg-red-100"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-[200px] p-6 bg-white shadow rounded-lg">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg" />
      <div className="flex items-center px-6 mt-12">
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={user.name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="text-gray-600 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
        </div>
        <div className="ml-auto">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.status
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <Activity className="h-4 w-4 inline mr-1" />
            {user.status ? "Đang hoạt động" : "Bị khóa"}
          </span>
        </div>
      </div>

      {/* Thông tin cá nhân */}
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
            <p className="font-medium capitalize">
              {user.role === "customer" ? "Khách hàng" : "Không xác định"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <User className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Địa chỉ</p>
            <p className="font-medium">{user.address || "Chưa có thông tin"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Calendar className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Ngày tham gia</p>
            <p className="font-medium">{joinDate}</p>
          </div>
        </div>
      </div>

      {/* Tài khoản & Form chỉnh sửa */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Tài khoản</h2>

        <button
          onClick={() => setShowEditForm(!showEditForm)}
          className="w-full flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50"
        >
          <Edit className="h-4 w-4" />
          {showEditForm ? "Đóng chỉnh sửa" : "Chỉnh sửa thông tin cá nhân"}
        </button>

        {showEditForm && (
          <EditProfileForm
            initialData={user}
            onUpdate={(updatedUser) => {
              setUser(updatedUser);
              setShowEditForm(false);
            }}
            onCancel={() => setShowEditForm(false)}
          />
        )}

        <button
          className="w-full flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50"
          onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
        >
          <Key className="h-4 w-4" />
          {showChangePasswordForm
            ? "Đóng"
            : user?.hasPassword
            ? "Thay đổi mật khẩu"
            : "Tạo mật khẩu"}
        </button>
        {showChangePasswordForm &&
          (user?.hasPassword ? (
            <ChangePasswordForm
              onSuccess={() => setShowChangePasswordForm(false)}
              onCancel={() => setShowChangePasswordForm(false)}
            />
          ) : (
            <SetPasswordForm
              onSuccess={() => {
                setShowChangePasswordForm(false);
                setUser((prev) => ({ ...prev, hasPassword: true }));
              }}
              onCancel={() => setShowChangePasswordForm(false)}
            />
          ))}

        <button
          className="w-full flex items-center gap-2 border px-4 py-3 rounded hover:bg-gray-50"
          onClick={() => setShowHistoryModal(true)}
        >
          <ShoppingBag className="h-4 w-4" /> Lịch sử mua hàng
        </button>
        <PurchaseHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      </div>
    </div>
  );
}
