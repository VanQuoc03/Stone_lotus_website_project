import { useEffect, useState } from "react";

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  title = "Danh mục",
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
    } else {
      setName("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {initialData ? `Chỉnh sửa ${title}` : `Thêm ${title}`}
        </h2>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Nhập tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave({ ...initialData, name });
              }
            }}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            {initialData ? "Lưu" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}
