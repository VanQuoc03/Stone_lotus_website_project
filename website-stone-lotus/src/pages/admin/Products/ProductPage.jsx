import ProductTable from "@/components/admin/product/ProductTable";
import { Filter, Plus, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import api from "@/utils/axiosInstance";
import useClickOutside from "@/hooks/useClickOutside";
import ProductModal from "@/components/admin/product/ProductModal";
import ProductDetailModal from "@/components/admin/product/ProductDetailModal";
import UpdateStockModal from "@/components/admin/product/UpdateStockModal";
import Pagination from "@/components/admin/customer/Pagination";
import useDebounce from "@/hooks/useDebounce";
import StockEntryModal from "@/components/admin/product/StockEntryModal";
import {
  fetchProducts as fetchProductsAPI,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProductStatus,
  toggleProductStatus,
  updateProductStock,
} from "@/services/admin/productService";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchDebounce = useDebounce(searchQuery);
  const [stockEntryProduct, setStockEntryProduct] = useState(null);

  const ref = useRef();
  useClickOutside(ref, () => setFilterOpen(false));

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [categoryFilter, searchDebounce, currentPage]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProductsAPI({
        search: searchDebounce,
        category: categoryFilter,
        page: currentPage,
        limit: 10,
      });

      const { products, total, page, totalPage } = res;

      const normalized = products.map((product) => ({
        ...product,
        images: Array.isArray(product.images)
          ? product.images
          : product.images
          ? [product.images]
          : [],
      }));

      setProducts(normalized);
      if (page !== currentPage) setCurrentPage(page);
      if (totalPage !== totalPages) setTotalPages(totalPage);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      setCategories(res);
    } catch (error) {
      console.log("Lỗi khi lấy danh mục", error);
    }
  };

  const handleSaveProduct = async (product) => {
    try {
      const productToSave = { ...product };

      if (product._id) {
        const updated = await updateProduct(productToSave);
        const normalizedProduct = {
          ...updated,
          images: Array.isArray(updated.images)
            ? updated.images.map((img) => img.image_url)
            : [],
        };

        setProducts((prev) =>
          prev.map((p) =>
            p._id === normalizedProduct._id ? normalizedProduct : p
          )
        );
      } else {
        const created = await addProduct(productToSave);
        const normalizedProduct = {
          ...created,
          images: Array.isArray(created.images)
            ? created.images.map((img) => img.image_url)
            : [],
        };

        setProducts((prev) => [normalizedProduct, ...prev]);
        setStockEntryProduct(normalizedProduct);
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

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteProducts(selectedProducts);
      setProducts((prev) =>
        prev.filter((p) => !selectedProducts.includes(p._id))
      );
      setSelectedProducts([]);
    } catch (err) {
      console.error("Lỗi khi xóa hàng loạt:", err);
    }
  };

  const handleBulkUpdateStatus = async (status) => {
    try {
      await bulkUpdateProductStatus(selectedProducts, status);
      setProducts((prev) =>
        prev.map((p) =>
          selectedProducts.includes(p._id) ? { ...p, status } : p
        )
      );
      setSelectedProducts([]);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    try {
      const updated = await toggleProductStatus(product._id, newStatus);
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? updated : p))
      );
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái:", err);
    }
  };

  const handleUpdateStock = async (id, quantity) => {
    try {
      await updateProductStock(id, quantity);
      loadProducts();
    } catch (err) {
      console.error("Lỗi khi cập nhật tồn kho:", err);
    }
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

  const allActive = selectedProducts.every(
    (id) => products.find((p) => p._id === id)?.status === "active"
  );
  const allInactive = selectedProducts.every(
    (id) => products.find((p) => p._id === id)?.status === "inactive"
  );

  return (
    <div className="flex flex-col gap-4">
      {selectedProducts.length > 0 && (
        <div className="bg-yellow-50 p-3 rounded flex justify-between items-center border">
          <span className="text-sm">
            {selectedProducts.length} sản phẩm được chọn
          </span>
          <div className="flex gap-2">
            {!allActive && (
              <button
                onClick={() => handleBulkUpdateStatus("active")}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded"
              >
                Hiển thị
              </button>
            )}
            {!allInactive && (
              <button
                onClick={() => handleBulkUpdateStatus("inactive")}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Ẩn
              </button>
            )}
            <button
              onClick={() => {
                if (
                  window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm này?")
                ) {
                  handleBulkDelete;
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

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

      {modalOpen && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveProduct}
          initialData={editData}
          categories={categories}
        />
      )}
      {viewProduct !== null && (
        <ProductDetailModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
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
        onToggleStatus={handleToggleStatus}
      />
      {stockEntryProduct && (
        <StockEntryModal
          product={stockEntryProduct}
          onClose={() => setStockEntryProduct(null)}
          onSave={loadProducts}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
