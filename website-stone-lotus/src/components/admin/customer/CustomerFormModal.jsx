import { useEffect, useState } from "react";

export default function CustomerFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    status: true,
  });
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        status: !!initialData.status,
      });
    } else {
      setForm({ name: "", email: "", password: "", status: true });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...form };
    if (initialData && !form.password) {
      delete dataToSubmit.password;
    }
    onSubmit(dataToSubmit, initialData?._id);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md w-full max-w-md p-6 relative">
        <button
          className="absolute text-2xl top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-4">
          {initialData ? "Cập nhật khách hàng" : "Thêm khách hàng"}
        </h1>
        <form action="" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="" className="block text-sm mb-1 font-medium">
              Tên
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="" className="block text-sm font-medium mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              required={!initialData}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
            />
            {initialData && (
              <p className="tex-xs text-gray-500 mt-1 italic">
                Để trống nếu không muốn thay đổi mật khẩu
              </p>
            )}
          </div>
          <div>
            <label htmlFor="" className="block text-sm font-medium mb-1">
              Trạng thái
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`relative w-12 h-6 flex items-center rounded-full px-1 transition-colors ${
                  form.status ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() =>
                  setForm((prev) => ({ ...prev, status: !prev.status }))
                }
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    form.status ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </button>
              <span className="text-sm">
                {form.status ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
            {!form.status && (
              <p className="mt-2 text-xs text-red-500 italic">
                Người dùng này sẽ bị vô hiệu hóa và không thể đăng nhập.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600 px-2 py-2 rounded"
            >
              {initialData ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
