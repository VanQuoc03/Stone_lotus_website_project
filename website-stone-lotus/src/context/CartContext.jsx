import { createContext, useContext, useState, useEffect } from "react";
import { getGuestCart } from "@/utils/guestCart"; // nếu có dùng guestCart
import api from "@/utils/axiosInstance";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  const updateCartCount = async () => {
    try {
      if (token) {
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
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
