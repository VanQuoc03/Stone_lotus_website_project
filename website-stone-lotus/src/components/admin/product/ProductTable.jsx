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
            <th className="w-[80px] p-2">Hình ảnh</th>
            <th>
              <div className="flex items-center gap-1">
                Sản phẩm
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </th>
            <th className="hidden md:table-cell p-2">Danh mục</th>
            <th className="p-2">
              <div className="flex items-center gap-1">
                Giá
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </th>
            <th className="p-2">
              <div className="flex items-center gap-1">
                Tồn kho
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </th>
            <th className="w-[50px] p-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
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
              <td className="p-2">{product.category?.name || "-"}</td>
              <td className="p-2">{formatCurrency(product.price)}</td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <span>{product.inventory?.quantity ?? 0}</span>
                  {product.inventory?.quantity < 20 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      Sắp hết
                    </span>
                  )}
                </div>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
