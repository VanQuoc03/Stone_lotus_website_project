import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import GuideFormSheet from "@/components/admin/care-guide/GuideFormSheet";
import api from "@/utils/axiosInstance";

export default function EditCareGuideButton({ guide, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: guide.title || "",
    excerpt: guide.excerpt || "",
    description: guide.description || "",
    readTime: guide.readTime || "",
    date: guide.date || "",
    content: guide.content || "",
    type: guide.type || "",
    images: guide.image ? [guide.image] : [],
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);
    setIsUploading(true);

    try {
      const res = await api.post("/api/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.imageUrl?.[0];
      setForm((prev) => ({ ...prev, images: [imageUrl] }));
    } catch (err) {
      alert("Upload ảnh thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) {
      alert("Vui lòng chờ ảnh được tải lên...");
      return;
    }

    try {
      await api.put(`/api/blog/posts/${guide._id}`, {
        ...form,
        image: form.images?.[0] || "",
      });

      onSuccess?.();
      setIsOpen(false);
    } catch (err) {
      alert("Lỗi khi cập nhật bài viết");
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1 text-sm"
      >
        <Pencil className="w-4 h-4" />
        Sửa
      </Button>
      <GuideFormSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={form}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onFileUpload={handleImageUpload}
        isEditing={true}
        isUploading={isUploading}
      />
    </>
  );
}
