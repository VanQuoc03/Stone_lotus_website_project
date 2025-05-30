import React from "react";
import { Eye, ShoppingBag } from "lucide-react"; // dùng lucide-react cho icon hiện đại
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };
  return (
    <div
      className="group relative border rounded-lg p-3 shadow-sm hover:shadow-lg transition text-center text-sm bg-white h-full flex flex-col justify-between"
      onClick={handleClick}
    >
      {/* ảnh sản phẩm */}
      <div className="relative">
        <img
          src={
            product.images?.[0]?.image_url || "https://via.placeholder.com/150"
          }
          alt={product.name}
          className="h-40 w-full object-cover rounded"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
          <Eye className="text-white w-6 h-6" />
        </div>
      </div>

      {/* nội dung sản phẩm */}
      <div className="flex-1 flex flex-col justify-between mt-2">
        <div className="min-h-[60px] flex flex-col justify-start">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[15px] font-bold text-black mt-1">
            {product.price.toLocaleString()}₫
          </p>
        </div>

        <button
          className="mt-3 w-full border border-green-600 text-green-600 font-medium rounded flex items-center justify-center gap-2 py-1 hover:bg-green-600 hover:text-white transition"
          onClick={(e) => e.stopPropagation()}
        >
          <ShoppingBag size={16} />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
