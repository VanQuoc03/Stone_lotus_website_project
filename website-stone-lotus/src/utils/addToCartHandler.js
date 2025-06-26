import api from "@/utils/axiosInstance";
import { addToGuestCart } from "@/utils/guestCart";

export const addToCart = async ({ product, quantity = 1, variantId = null, updateCartCount, showSuccess }) => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      await api.post("/api/cart/add", {
        productId: product._id,
        quantity,
        variantId,
      });
    } else {
      addToGuestCart({ ...product, quantity });
    }

    if (updateCartCount) updateCartCount();
    if (showSuccess) showSuccess();
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng:", err);
  }
};
