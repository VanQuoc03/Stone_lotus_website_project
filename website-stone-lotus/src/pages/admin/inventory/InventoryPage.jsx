import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Pagination from "@/components/admin/customer/Pagination";
import dayjs from "dayjs";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 10,
        includeInactive: true,
      };
      if (categoryFilter !== "all") {
        params.category = categoryFilter;
      }
      const res = await api.get("/api/products", { params });
      const { products, total, page, totalPage } = res.data;
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
      console.error("Lỗi lấy sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedStatus, categoryFilter, currentPage]);

  const filteredInventory = products.filter((item) => {
    const stock = item.inventory?.quantity || 0;
    const status =
      stock === 0 ? "Hết hàng" : stock <= 5 ? "Sắp hết" : "Còn hàng";

    const matchesStatus =
      selectedStatus === "Tất cả" || status === selectedStatus;
    return matchesStatus;
  });
  console.log("Filtered Inventory:", filteredInventory);

  const getStatus = (quantity) => {
    if (quantity === 0) return "Hết hàng";
    if (quantity <= 5) return "Sắp hết";
    return "Còn hàng";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý kho hàng</h1>
        <button className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc SKU..."
              className="w-full rounded-md border border-gray-300 py-2 pl-8 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div className="relative">
            <select
              className="h-9 rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all" key="all">
                Tất cả danh mục
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              className="h-9 rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {["Tất cả", "Còn hàng", "Sắp hết", "Hết hàng"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button className="h-9 rounded-md border px-4 py-2 text-sm text-gray-700">
            <Download className="mr-2 h-4 w-4" /> Xuất
          </button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Hình ảnh
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Sản phẩm
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Danh mục
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Giá nhập
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Giá bán
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Tồn kho
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Trạng thái
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Cập nhật
                </th>
                <th className="h-10 px-4 text-left font-medium text-gray-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const quantity = item.inventory?.quantity || 0;
                const status = getStatus(quantity);
                return (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">
                      <img
                        src={item.images?.[0]?.image_url || "/placeholder.svg"}
                        alt={item.name}
                        width={40}
                        height={40}
                      />
                    </td>
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4">{item.category?.name || ""}</td>
                    <td className="p-4">
                      {item.purchasePrice?.toLocaleString("vi-VN") || "0"} ₫
                    </td>
                    <td className="p-4">
                      {item.price?.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="p-4">{quantity}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          status === "Còn hàng"
                            ? "bg-green-100 text-green-800"
                            : status === "Sắp hết"
                            ? "bg-red-500 text-white"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-4">
                      {dayjs(
                        item.inventory.last_updated || item.updatedAt
                      ).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="rounded-md border border-gray-300 p-1 text-gray-500 hover:bg-gray-50">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button className="rounded-md border border-gray-300 p-1 text-gray-500 hover:bg-gray-50">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
