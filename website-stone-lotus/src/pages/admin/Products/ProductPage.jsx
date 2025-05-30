import ProductTable from "@/components/admin/product/ProductTable";
import { Filter, Plus, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import api from "@/utils/axiosInstance";
import useClickOutside from "@/hooks/useClickOutside";
import ProductModal from "@/components/admin/product/ProductModal";
import ProductDetailModal from "@/components/admin/product/ProductDetailModal";
import UpdateStockModal from "@/components/admin/product/UpdateStockModal";

export default function ProductPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);

  const ref = useRef();
  useClickOutside(ref, () => setFilterOpen(false));

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/products", {
        params: {
          search: searchQuery || undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
        },
      });
      const normalized = res.data.map((product) => ({
        ...product,
        images: Array.isArray(product.images)
          ? product.images
          : product.images
          ? [product.images]
          : [],
      }));
      setProducts(normalized);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      console.log(res);
      setCategories(res.data);
    } catch (error) {
      console.log("Lỗi khi lấy danh mục", error);
    }
  };

  const addProduct = async (product) => {
    const res = await api.post("/api/products", product);
    return res.data;
  };

  const updateProduct = async (product) => {
    const res = await api.put(`/api/products/${product._id}`, product);
    return res.data;
  };

  const deleteProduct = async (id) => {
    await api.delete(`/api/products/${id}`);
  };

  const toggleProductSelection = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
    }
  };

  const handleAddProduct = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditData(product);
    setModalOpen(true);
  };

  const handleSaveProduct = async (product) => {
    try {
      const productToSave = {
        ...product,
        images: product.images, // vẫn là mảng string
      };

      if (product._id) {
        const updated = await updateProduct(productToSave);

        // 👉 Lấy array các URL từ array object trả về
        const normalizedImages = Array.isArray(updated.images)
          ? updated.images.map((img) => img.image_url)
          : [];

        const normalizedProduct = {
          ...updated,
          images: normalizedImages,
        };

        setProducts((prev) =>
          prev.map((p) =>
            p._id === normalizedProduct._id ? normalizedProduct : p
          )
        );
      } else {
        const created = await addProduct(productToSave);

        const normalizedImages = Array.isArray(created.images)
          ? created.images.map((img) => img.image_url)
          : [];

        const normalizedProduct = {
          ...created,
          images: normalizedImages,
        };

        setProducts((prev) => [...prev, normalizedProduct]);
      }
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
    } finally {
      setModalOpen(false);
      setEditData(null);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  //Cập nhật tồn kho
  const handleUpdateStock = async (id, quantity) => {
    try {
      await api.put(`/api/products/${id}/stock`, { quantity });
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi cập nhật tồn kho:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sản phẩm</h1>
        <button
          onClick={handleAddProduct}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="w-[180px] rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all" key="all">
              Tất cả danh mục
            </option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100"
          >
            <Filter className="h-4 w-4" />
          </button>
          {filterOpen && (
            <div
              className="absolute w-48 right-0 z-10 rounded border bg-white shadow-md"
              ref={ref}
            >
              <div className="px-4 py-2 text-sm font-semibold">Lọc theo</div>
              <div className="border-t px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                Sắp hết hàng
              </div>
              <div className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                Hết hàng
              </div>
              <div className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                Đang giảm giá
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editData}
        categories={categories}
      />
      <ProductDetailModal
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />

      <UpdateStockModal
        product={stockProduct}
        onClose={() => setStockProduct(null)}
        onSave={handleUpdateStock}
      />

      <ProductTable
        products={products}
        selectedProducts={selectedProducts}
        toggleProductSelection={toggleProductSelection}
        toggleAllProducts={toggleAllProducts}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onViewProduct={setViewProduct}
        onUpdateStock={setStockProduct}
      />
    </div>
  );
}
