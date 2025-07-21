import { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/axiosInstance";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Theo dõi sự thay đổi token từ localStorage
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateCartCount = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        const res = await api.get("/api/cart");
        const count = res.data?.items?.length || 0;
        setCartCount(count);
      } else {
        // Nếu không có token, giỏ hàng phải rỗng
        setCartCount(0);
      }
    } catch (err) {
      console.error("Lỗi lấy số lượng giỏ hàng:", err);
      setCartCount(0);
    }
  };

  const getCartItemQuantity = async (productId) => {
    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) {
        return 0; // Nếu không có token, không có sản phẩm trong giỏ hàng đăng nhập
      }
      const res = await api.get("/api/cart");
      if (res.status !== 200 || !res.data || !res.data.items) {
        return 0;
      }
      const item = res.data.items.find(
        (i) => i.product && i.product._id === productId
      );
      return item ? item.quantity : 0;
    } catch (err) {
      console.error("Lỗi lấy số lượng sản phẩm trong giỏ hàng:", err);
      return 0;
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [token]);

  return (
    <CartContext.Provider
      value={{ cartCount, updateCartCount, getCartItemQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
