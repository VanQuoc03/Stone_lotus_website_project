import { useState } from "react";
import api from "@/utils/axiosInstance";
import { Key } from "lucide-react";

export default function SetPasswordForm({ onSuccess, onCancel }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/set-password", {
        newPassword,
      });

      setSuccess("Thiết lập mật khẩu thành công!");
      setNewPassword("");
      setConfirmPassword("");

      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 mt-4 rounded shadow space-y-4"
    >
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-lg">Thiết lập mật khẩu</h3>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Mật khẩu mới</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            onClick={onCancel}
          >
            Hủy
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu mật khẩu"}
        </button>
      </div>
    </form>
  );
}
