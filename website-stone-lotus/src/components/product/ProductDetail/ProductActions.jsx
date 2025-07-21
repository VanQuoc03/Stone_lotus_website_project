import { useCart } from "@/context/CartContext";
import { addToCart } from "@/utils/addToCartHandler";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductActions({
  product,
  quantity,
  variant,
  availableStock,
}) {
  const { updateCartCount, getCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const handleUnauthorized = () => {
    toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleAdd = async () => {
    try {
      const currentQuantity = await getCartItemQuantity(product._id);
      const totalQuantity = currentQuantity + quantity;
      if (totalQuantity > availableStock) {
        toast.error(
          `Số lượng yêu cầu (${totalQuantity}) vượt quá số lượng trong kho (${availableStock}). ` +
            `Giỏ hàng đã có ${currentQuantity} sản phẩm, chỉ có thể thêm ${
              availableStock - currentQuantity
            } sản phẩm nữa.`
        );
        return;
      }
      await addToCart({
        product,
        quantity,
        variantId: variant?._id,
        updateCartCount,
        onUnauthorized: handleUnauthorized, // Pass the handler
        showSuccess: () => toast.success("Đã thêm sản phẩm vào giỏ hàng!"), // Only show success when actually added
      });
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      // onUnauthorized đã được gọi trong addToCart nếu cần thiết
      toast.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  const handleBuyNow = async () => {
    try {
      const currentQuantity = await getCartItemQuantity(product._id);
      const totalQuantity = currentQuantity + quantity;
      if (totalQuantity > availableStock) {
        toast.error(
          `Số lượng yêu cầu (${totalQuantity}) vượt quá số lượng trong kho (${availableStock}). ` +
            `Giỏ hàng đã có ${currentQuantity} sản phẩm, chỉ có thể thêm ${
              availableStock - currentQuantity
            } sản phẩm nữa.`
        );
        return;
      }
      await addToCart({
        product,
        quantity,
        variantId: variant?._id,
        updateCartCount,
        onUnauthorized: handleUnauthorized,
        showSuccess: () =>
          toast.success("Đã thêm sản phẩm, chuyển đến thanh toán..."), // Only show success when actually added
      });
      navigate("/checkout", {
        state: {
          buyNowItem: {
            productId: product._id,
            quantity,
            variantId: variant?._id,
          },
        },
      });
    } catch (error) {
      console.error("Lỗi khi mua ngay:", error);
      toast.error(
        error.response?.data?.error || "Lỗi khi thêm sản phẩm để thanh toán"
      );
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        disabled={availableStock === 0}
        className={`flex-1 font-bold  ${
          availableStock === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-white border border-green-600 text-green-600 hover:bg-[#347764] hover:text-white"
        }
           px-4 py-2 rounded transition`}
        onClick={handleAdd}
      >
        THÊM VÀO GIỎ
      </button>
      <button
        disabled={availableStock === 0}
        className={`flex-1 font-bold ${
          availableStock === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#27846a] text-white hover:bg-[#347764]"
        } px-4 py-2 rounded transition`}
        onClick={handleBuyNow}
      >
        MUA NGAY
      </button>
    </div>
  );
}
