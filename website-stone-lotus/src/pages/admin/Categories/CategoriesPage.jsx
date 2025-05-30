import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import CategoryModal from "@/components/admin/categories/CategoryModal";
import api from "@/utils/axiosInstance";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category) => {
    const res = await api.post("/api/categories", category);
    return res.data;
  };

  const updateCategory = async (category) => {
    const res = await api.put(`/api/categories/${category._id}`, category);
    return res.data;
  };

  const deleteCategory = async (id) => {
    await api.delete(`/api/categories/${id}`);
  };

  const toggleCategorySelection = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat._id));
    }
  };

  const handleAddCategory = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleSaveCategory = async (category) => {
    try {
      if (category._id) {
        const updated = await updateCategory(category);
        setCategories((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
      } else {
        const created = await addCategory(category);
        setCategories((prev) => [...prev, created]);
      }
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    } finally {
      setModalOpen(false);
      setEditData(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (error) {
      if (error.response?.status === 403) {
        alert("Không thể xóa danh mục vì có sản phẩm đang sử dụng!");
      } else {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Xảy ra lỗi khi xóa danh mục.");
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditData(category);
    setModalOpen(true);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Danh mục</h1>
        <button
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded gap-2 text-sm font-medium"
          onClick={handleAddCategory}
        >
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="w-full border border-gray-300 rounded bg-white pr-4 py-2 pl-8 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editData}
        title="danh mục"
      />

      {loading ? (
        <div>Đang tải danh mục...</div>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          selectedCategories={selectedCategories}
          toggleCategorySelection={toggleCategorySelection}
          toggleAllCategories={toggleAllCategories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
}
