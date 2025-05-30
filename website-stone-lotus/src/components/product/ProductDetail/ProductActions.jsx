import React from "react";

export default function ProductActions({ product, quantity, selectedVariant }) {
  return (
    <div className="flex gap-4 mt-4">
      <button className="flex-1 font-bold bg-white border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-[#347764] hover:text-white transition">
        THÊM VÀO GIỎ
      </button>
      <button className="flex-1 font-bold bg-[#27846a] text-white px-4 py-2 rounded hover:bg-[#347764] transition">
        MUA NGAY
      </button>
    </div>
  );
}
