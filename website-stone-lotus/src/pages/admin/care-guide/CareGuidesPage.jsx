import CareGuidesModal from "@/components/admin/care-guide/CareGuidesModal";
import api from "@/utils/axiosInstance";
import { Eye, SquarePen } from "lucide-react";
import React, { useEffect, useState } from "react";
import CareGuidesEditModal from "@/components/admin/care-guide/CareGuidesEditModal";

export default function CareGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    description: "",
    readTime: "",
    date: "",
    content: "",
    type: "",
    images: [""],
  });

  const fetchGuides = async () => {
    try {
      const res = await api.get("/api/blog/posts");
      setGuides(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu", error);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    const filteredData = guides.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(filteredData);
  }, [searchQuery, guides]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageInputChange = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await api.post("/api/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const urls = res.data.imageUrls; // <- lấy từ backend
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      alert("Upload thất bại: " + err.message);
    }
  };

  const handleImageChange = (index, e) => {
    const updated = [...form.images];
    updated[index] = e.target.value;
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const handleImageAdd = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleImageRemove = (index) => {
    if (form.images.length === 1) return alert("Cần ít nhất 1 ảnh.");
    const updated = form.images.filter((_, idx) => idx !== index);
    setForm((prev) => ({ ...prev, images: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/blog/posts", {
        title: form.title,
        excerpt: form.excerpt,
        description: form.description,
        readTime: form.readTime,
        date: form.date,
        content: form.content,
        type: form.type,
        image: form.images[0],
      });
      setForm({
        title: "",
        excerpt: "",
        description: "",
        readTime: "",
        date: "",
        content: "",
        type: "",
        images: [""],
      });
      setShowModal(false);
      fetchGuides();
    } catch (err) {
      console.error("Lỗi thêm bài viết:", err);
    }
  };
  const handleEditClick = (guide) => {
    setForm({
      title: guide.title || "",
      excerpt: guide.excerpt || "",
      description: guide.description || "",
      readTime: guide.readTime || "",
      date: guide.date?.slice(0, 10) || "", // ISO format for input[type="date"]
      content: guide.content || "",
      type: guide.type || "",
      images: guide.image ? [guide.image] : [""],
    });
    setEditingGuide(guide);
    setShowEditModal(true);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingGuide?._id) return;

    try {
      await api.put(`/api/blog/posts/${editingGuide._id}`, {
        title: form.title,
        excerpt: form.excerpt,
        description: form.description,
        readTime: form.readTime,
        date: form.date,
        content: form.content,
        type: form.type,
        image: form.images[0],
      });
      setShowEditModal(false);
      setEditingGuide(null);
      setForm({
        title: "",
        excerpt: "",
        description: "",
        readTime: "",
        date: "",
        content: "",
        type: "",
        images: [""],
      });
      fetchGuides();
    } catch (err) {
      console.error("Lỗi cập nhật bài viết:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hướng dẫn chăm sóc mấy em đào</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Thêm hướng dẫn
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm hướng dẫn"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <div className="flex gap-2">
          {["grid", "list"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded border ${
                viewMode === mode
                  ? "bg-green-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <div
              key={guide._id}
              className="relative group bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between"
            >
              {/* Ảnh đại diện */}
              <div className="relative h-40 bg-gray-200 flex items-center justify-center">
                <img
                  src={guide.image || "/placeholder.svg"}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                />

                {/* Overlay buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <a
                    href={`/admin/care-guides/${guide._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-1"
                  >
                    <Eye />
                  </a>
                  <button
                    onClick={() => handleEditClick(guide)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded flex items-center gap-1"
                  >
                    <SquarePen /> Sửa
                  </button>
                </div>
              </div>

              {/* Nội dung */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {guide.views || 0} lượt xem
                  </span>
                </div>
                <h2 className="text-base font-semibold line-clamp-1">
                  {guide.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {guide.content}
                </p>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <span>
                    Ngày tạo:{" "}
                    {new Date(guide.created_at).toLocaleDateString("vi-VN")}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={`/admin/care-guides/${guide._id}`}
                      className="text-blue-600 hover:underline"
                      title="Xem chi tiết"
                    >
                      <Eye />
                    </a>
                    <button
                      onClick={() => handleEditClick(guide)}
                      className="text-orange-500 hover:underline"
                      title="Chỉnh sửa"
                    >
                      <SquarePen />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Tiêu đề</th>
              <th className="text-left px-4 py-2">Danh mục</th>
              <th className="text-left px-4 py-2">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((guide) => (
              <tr key={guide._id} className="border-t">
                <td className="px-4 py-2">{guide.title}</td>
                <td className="px-4 py-2">{guide.type}</td>
                <td className="px-4 py-2">
                  {new Date(guide.created_at).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <CareGuidesModal
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          onFileUpload={handleImageInputChange}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
          onImageChange={handleImageChange}
        />
      )}
      {showEditModal && (
        <CareGuidesEditModal
          form={form}
          onChange={handleFormChange}
          onSubmit={handleUpdate}
          onClose={() => {
            setShowEditModal(false);
            setEditingGuide(null);
          }}
          onFileUpload={handleImageInputChange}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
          onImageChange={handleImageChange}
        />
      )}
    </div>
  );
}
