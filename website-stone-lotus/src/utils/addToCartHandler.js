import api from "@/utils/axiosInstance";

export const addToCart = async ({
  product,
  quantity = 1,
  variantId = null,
  updateCartCount,
  showSuccess,
  onUnauthorized,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    if (onUnauthorized) onUnauthorized();
    return;
  }

  try {
    await api.post("/api/cart/add", {
      productId: product._id,
      quantity,
      variantId,
    });

    if (updateCartCount) updateCartCount();
    if (showSuccess) showSuccess();
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng:", err);
  }
};
