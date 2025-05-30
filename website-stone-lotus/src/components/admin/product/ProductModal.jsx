import { useEffect, useState } from "react";

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
}) {
  const [form, setForm] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    images: [""],
    category: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        _id: initialData._id || "",
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        quantity: initialData.inventory?.quantity || 0,
        images:
          Array.isArray(initialData.images) && initialData.images.length > 0
            ? initialData.images.map((img) =>
                typeof img === "string" ? img : img.image_url
              )
            : [""],
        category: initialData.category?._id || "",
      });
    } else {
      setForm({
        _id: "",
        name: "",
        description: "",
        price: "",
        quantity: "",
        images: [],
        category: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "quantity"].includes(name) ? Number(value) : value,
    }));
  };

  const handleImageChange = (index, e) => {
    const updated = [...form.images];
    updated[index] = e.target.value;
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const handleAddImage = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleRemoveImage = (index) => {
    if (form.images.length === 1) {
      alert("Sản phẩm cần ít nhất 1 ảnh.");
      return;
    }

    const updated = form.images.filter((_, idx) => idx !== index);
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.imageUrl) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, data.imageUrl],
        }));
      } else {
        alert("Tải ảnh thất bại.");
      }
    } catch (err) {
      console.error("Upload lỗi:", err);
      alert("Lỗi khi upload ảnh");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          ></textarea>
          <input
            type="number"
            name="price"
            placeholder="Giá"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Tồn kho"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="space-y-2">
            <label className="block font-semibold">Ảnh sản phẩm:</label>

            {/* Upload từ máy */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full"
            />

            {/* Xem trước & xoá */}
            {form.images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(idx, e)}
                  className="flex-1 border p-2 rounded"
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="text-red-500 font-semibold"
                  >
                    Xoá
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddImage}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              + Thêm ảnh
            </button>

            {/* Preview ảnh */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Ảnh ${idx + 1}`}
                  className="h-16 w-16 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {initialData ? "Lưu" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
