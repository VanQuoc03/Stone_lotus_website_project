import React, { useState } from "react";
import api from "@/utils/axiosInstance";
export default function ChangePasswordForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccessMsg(null);
    try {
      const res = await api.post("/api/change-password", formData);
      setSuccessMsg(res.data.message);
      onSuccess?.();
    } catch (err) {
      setError(
        err.response?.data?.message || "Đã có lỗi xảy ra vui lòng thử lại.  "
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form action="" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor=""
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mật khẩu hiện tại
        </label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Mật khẩu hiện tại..."
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label
          htmlFor=""
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mật khẩu mới
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Mật khẩu mới..."
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Đang xử lý" : "Lưu thay đổi"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
