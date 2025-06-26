import React from "react";
import ReactQuill from "react-quill";

export default function CareGuidesEditModal({
  form,
  onChange,
  onSubmit,
  onClose,
  onImageAdd,
  onImageRemove,
  onFileUpload,
  onImageChange,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa hướng dẫn</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề"
            className="w-full border px-3 py-2 rounded"
            value={form.title}
            onChange={onChange}
            required
          />

          <textarea
            name="excerpt"
            placeholder="Mô tả ngắn (excerpt)"
            className="w-full border px-3 py-2 rounded"
            rows={2}
            value={form.excerpt}
            onChange={onChange}
          />

          <textarea
            name="description"
            placeholder="Mô tả dài (description)"
            className="w-full border px-3 py-2 rounded"
            rows={3}
            value={form.description}
            onChange={onChange}
          />

          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            className="bg-white rounded"
            style={{ height: "200px", marginBottom: "20px" }}
          />

          <input
            type="text"
            name="readTime"
            placeholder="Thời gian đọc (VD: 3 phút)"
            className="w-full border px-3 py-2 rounded"
            value={form.readTime}
            onChange={onChange}
          />

          <input
            type="date"
            name="date"
            className="w-full border px-3 py-2 rounded"
            value={form.date}
            onChange={onChange}
          />

          <div className="space-y-2">
            <label className="block font-semibold">Ảnh minh hoạ:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFileUpload}
              className="w-full"
            />

            {form.images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => onImageChange(idx, e)}
                  className="flex-1 border p-2 rounded"
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onImageRemove(idx)}
                    className="text-red-500 font-semibold"
                  >
                    Xoá
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={onImageAdd}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              + Thêm ảnh
            </button>

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

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
