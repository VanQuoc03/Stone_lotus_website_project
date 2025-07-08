import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Trash2, FilePenLine } from "lucide-react";

import api from "@/utils/axiosInstance";
import React, { useEffect, useState, useCallback } from "react";
import GuideFormSheet from "@/components/admin/care-guide/GuideFormSheet";

export default function CareGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    description: "",
    readTime: "",
    date: "",
    content: "",
    type: "",
    images: [], // Changed to empty array to simplify logic
  });

  const fetchGuides = useCallback(async () => {
    try {
      const res = await api.get("/api/blog/posts");
      setGuides(res.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu", error);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file); // Use single image upload

    try {
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.imageUrl;
      setForm((prev) => ({ ...prev, images: [imageUrl] }));
    } catch (err) {
      alert("Upload thất bại: " + err.message);
    }
  };

  const resetFormAndCloseSheet = () => {
    setForm({
      title: "",
      content: "",
      type: "",
      images: [],
    });
    setEditingGuide(null);
    setIsSheetOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...form,
      image: form.images[0] || "",
    };

    try {
      if (editingGuide) {
        await api.put(`/api/blog/posts/${editingGuide._id}`, submissionData);
      } else {
        await api.post("/api/blog/posts", submissionData);
      }
      resetFormAndCloseSheet();
      fetchGuides();
    } catch (err) {
      console.error("Lỗi khi gửi bài viết:", err);
    }
  };

  const handleAddNewClick = () => {
    setEditingGuide(null);
    setForm({
      title: "",
      content: "",
      type: "",
      images: [],
    });
    setIsSheetOpen(true);
  };

  const handleEditClick = (guide) => {
    setEditingGuide(guide);
    setForm({
      title: guide.title || "",
      content: guide.content || "",
      type: guide.type || "",
      images: guide.image ? [guide.image] : [],
    });
    setIsSheetOpen(true);
  };

  const handleDelete = async (guideId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hướng dẫn này không?")) {
      try {
        await api.delete(`/api/blog/posts/${guideId}`);
        fetchGuides();
      } catch (error) {
        console.error("Lỗi xóa bài viết:", error);
      }
    }
  };

  const filteredGuides = guides.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Hướng dẫn Chăm sóc
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Thêm, sửa, xóa và quản lý các bài hướng dẫn chăm sóc cây.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16">
          <Button onClick={handleAddNewClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm Hướng dẫn
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Ảnh
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Tiêu đề
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Loại
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Ngày tạo
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredGuides.map((guide) => (
              <tr key={guide._id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <img
                    src={guide.image || "https://via.placeholder.com/150"}
                    alt={guide.title}
                    className="h-10 w-16 object-cover rounded-md"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{guide.title}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {guide.type}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(guide.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(guide)}>
                        <FilePenLine className="mr-2 h-4 w-4" />
                        <span>Sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(guide._id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GuideFormSheet
        isOpen={isSheetOpen}
        onClose={() => {
          resetFormAndCloseSheet();
        }}
        form={form}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onFileUpload={handleImageUpload}
        isEditing={!!editingGuide}
      />
    </div>
  );
}
