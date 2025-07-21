import React from "react";
import SwapIcon from "../../assets/icon_product/SortIcon";

export default function SortFilter({ onSortChange }) {
  const handleChange = (e) => {
    const value = e.target.value;
    onSortChange?.(value);
  };

  return (
    <div className="relative mb-6 flex items-center justify-end">
      <div className="relative w-56">
        <select
          className=" border rounded w-full pl-10 pr-4 py-2 text-sm"
          onChange={handleChange}
        >
          <option value="">Sắp xếp</option>
          <option value="price_asc">Giá: Tăng dần</option>
          <option value="price_desc">Giá: Giảm dần</option>
          <option value="name_asc">Tên: A-Z</option>
          <option value="name_desc">Tên: Z-A</option>
          <option value="created_desc">Mới nhất</option>
          <option value="created_asc">Cũ nhất</option>
          {/* <option value="bestseller">Bán chạy nhất</option> */}
          <option value="stock_desc">Tồn kho giảm dần</option>
        </select>

        {/* Icon nằm bên trái trong ô select */}
        <div className="absolute top-2.5 left-2">
          <SwapIcon size={20} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
}
