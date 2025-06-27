import { createContext, useContext, useState, useEffect } from "react";
import { getGuestCart } from "@/utils/guestCart"; // nếu có dùng guestCart
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
        const guestCart = getGuestCart();
        setCartCount(guestCart.length);
      }
    } catch (err) {
      console.error("Lỗi lấy số lượng giỏ hàng:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, [token]); // ← mỗi lần token thay đổi, update cart

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
