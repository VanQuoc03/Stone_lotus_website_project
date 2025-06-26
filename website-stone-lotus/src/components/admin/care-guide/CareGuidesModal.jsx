import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CareGuidesModal({
  form,
  onChange,
  onSubmit,
  onClose,
  onImageAdd,
  onImageRemove,
  onFileUpload,
  onImageChange,
}) {
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Thêm hướng dẫn</h2>
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

          <input
            type="text"
            name="excerpt"
            placeholder="Tóm tắt"
            className="w-full border px-3 py-2 rounded"
            value={form.excerpt}
            onChange={onChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Mô tả chi tiết"
            className="w-full border px-3 py-2 rounded"
            value={form.description}
            onChange={onChange}
          />

          <input
            type="text"
            name="readTime"
            placeholder="Thời gian đọc (ví dụ: 3 phút)"
            className="w-full border px-3 py-2 rounded"
            value={form.readTime}
            onChange={onChange}
          />
          <div className="mb-4">
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(value) =>
                onChange({ target: { name: "content", value } })
              }
              className="bg-white rounded"
              style={{ height: "300px", marginBottom: "20px" }}
              modules={quillModules}
              formats={quillFormats}
            />
          </div>

          <div className="space-y-2 mt-4">
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
