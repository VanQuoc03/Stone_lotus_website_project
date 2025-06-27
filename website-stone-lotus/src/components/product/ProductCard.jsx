import React, { useState } from "react";
import { Eye, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";
import { useCart } from "@/context/CartContext";
import { addToCart } from "@/utils/addToCartHandler";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  // const [showToast, setShowToast] = useState(false);
  const { updateCartCount } = useCart();

  const handleClick = () => {
    navigate(`/products/${product.id || product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart({
      product,
      quantity: 1,
      updateCartCount,
      showSuccess: () => toast.success("Đã thêm vào giỏ hàng!"),
      onUnauthorized: () => navigate("/login"),
    });
  };

  return (
    <>
      {/* {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded shadow-lg">
          ✅ Đã thêm vào giỏ hàng!
        </div>
      )} */}

      <div
        className="group relative border rounded-lg p-3 shadow-sm hover:shadow-lg transition text-center text-sm bg-white h-full flex flex-col justify-between"
        onClick={handleClick}
      >
        {/* ảnh sản phẩm */}
        <div className="relative">
          <img
            src={
              product.images?.[0]?.image_url ||
              "https://via.placeholder.com/150"
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
            onClick={handleAddToCart}
          >
            <ShoppingBag size={16} />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </>
  );
}
