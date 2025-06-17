// ProductTable.jsx
import dayjs from "dayjs";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function ProductTable({
  products,
  selectedProducts,
  toggleProductSelection,
  toggleAllProducts,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
  onUpdateStock,
  onToggleStatus,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.closest(".dropdown-toggle")
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStockStatus = (qty) => {
    if (!qty) return "Hết hàng";
    if (qty <= 5) return "Sắp hết";
    return "Còn hàng";
  };

  return (
    <div className="overflow-auto rounded border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="w-[50px] p-2">
              <input
                type="checkbox"
                checked={
                  selectedProducts.length === products.length &&
                  products.length > 0
                }
                onChange={toggleAllProducts}
              />
            </th>
            <th className="w-[80px] p-2">Hình</th>
            <th>Sản phẩm</th>
            {/* <th>Mã SKU</th> */}
            <th className="hidden md:table-cell p-2">Danh mục</th>
            <th className="p-2">Giá nhập</th>
            <th className="p-2">Giá bán</th>
            <th className="p-2">Tồn kho</th>
            <th className="p-2">Trạng thái kho</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Ngày tạo</th>
            <th className="p-2">Cập nhật tồn kho</th>
            <th className="w-[50px] p-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const quantity = product.inventory?.quantity || 0;
            const stockStatus = getStockStatus(quantity);
            return (
              <tr key={product._id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                  />
                </td>
                <td className="p-2">
                  <img
                    src={product.images?.[0]?.image_url || "/placeholder.svg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                </td>
                <td className="p-2">
                  <div className="font-medium">{product.name}</div>
                  <div className="hidden text-xs text-gray-500 md:block">
                    {product.description?.length > 50
                      ? `${product.description.slice(0, 50)}...`
                      : product.description}
                  </div>
                </td>
                {/* <td className="p-2">{product.sku || '-'}</td> */}
                <td className="p-2">{product.category?.name || '-'}</td>
                <td className="p-2">{formatCurrency(product.purchasePrice)}</td>
                <td className="p-2">{formatCurrency(product.price)}</td>
                <td className="p-2">{quantity}</td>
                <td className="p-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      stockStatus === "Còn hàng"
                        ? "bg-green-100 text-green-800"
                        : stockStatus === "Sắp hết"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {stockStatus}
                  </span>
                </td>
                <td className="p-2">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status === "active" ? "Đang bán" : "Ngừng bán"}
                  </span>
                </td>
                <td className="p-2">
                  {dayjs(product.createdAt).format("DD/MM/YYYY - HH:mm")}
                </td>
                <td className="p-2">
                  {dayjs(product.inventory?.last_updated || product.updatedAt).format("DD/MM/YYYY - HH:mm")}
                </td>
                <td className="relative p-2">
                  <button
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === product._id ? null : product._id
                      )
                    }
                    className="rounded-full p-1 hover:bg-gray-100 dropdown-toggle"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {dropdownOpen === product._id && (
                    <div
                      className="absolute right-0 z-10 mt-2 w-48 rounded-md border bg-white shadow-md"
                      ref={ref}
                    >
                      <div className="px-4 py-2 text-sm font-semibold">
                        Thao tác
                      </div>
                      <div
                        className="border-t px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => onEditProduct(product)}
                      >
                        Chỉnh sửa sản phẩm
                      </div>
                      <div
                        className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          onViewProduct(product);
                          setDropdownOpen(null);
                        }}
                      >
                        Xem chi tiết
                      </div>
                      <div
                        className="px-4 py-2 text-sm hover:bg-red-100 cursor-pointer text-red-600"
                        onClick={() => {
                          onToggleStatus(product);
                          setDropdownOpen(null);
                        }}
                      >
                        {product.status === "active"
                          ? "Ẩn sản phẩm"
                          : "Hiển thị sản phẩm"}
                      </div>
                      <div
                        className="border-t px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          onUpdateStock(product);
                          setDropdownOpen(null);
                        }}
                      >
                        Cập nhật tồn kho
                      </div>
                      <div
                        className="border-t px-4 py-2 text-sm hover:bg-red-100 text-red-600 cursor-pointer"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Bạn có chắc muốn xóa sản phẩm này không?"
                            )
                          ) {
                            onDeleteProduct(product._id);
                          }
                        }}
                      >
                        Xóa sản phẩm
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}