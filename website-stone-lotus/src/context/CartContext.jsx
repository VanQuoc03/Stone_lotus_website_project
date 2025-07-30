import { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/axiosInstance";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [discount, setDiscount] = useState(() => {
    const storedDiscount = localStorage.getItem("appliedDiscount");
    return storedDiscount ? parseFloat(storedDiscount) : 0;
  });
  const [appliedPromotion, setAppliedPromotion] = useState(() => {
    const storedPromo = localStorage.getItem("appliedPromotionDetails");
    return storedPromo ? JSON.parse(storedPromo) : null;
  });

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

  const applyPromotion = (promoDiscount, promoDetails) => {
    setDiscount(promoDiscount);
    setAppliedPromotion(promoDetails);
    localStorage.setItem("appliedDiscount", promoDiscount.toString());
    localStorage.setItem(
      "appliedPromotionDetails",
      JSON.stringify(promoDetails)
    );
  };

  const clearPromotion = () => {
    setDiscount(0);
    setAppliedPromotion(null);
    localStorage.removeItem("appliedDiscount");
    localStorage.removeItem("appliedPromotionDetails");
  };

  useEffect(() => {
    const validateInitialPromotion = async () => {
      if (!appliedPromotion) return;
      try {
        const res = await api.post("/api/promotions/validate", {
          promoCode: appliedPromotion.code,
        });
        if (!res.data?.valid) {
          clearPromotion();
        } else {
          setDiscount(res.data.discount);
        }
      } catch (err) {
        console.warn("Không thể xác minh mã giảm giá: ", err);
        clearPromotion();
      }
    };
    validateInitialPromotion();
  }, []);

  useEffect(() => {
    const validatePromotionOnCartChange = async () => {
      if (!appliedPromotion) return;
      try {
        const res = await api.post("/api/promotions/validate", {
          promoCode: appliedPromotion.code,
        });
        if (!res.data?.valid) {
          clearPromotion();
        } else {
          setDiscount(res.data.discount);
        }
      } catch (err) {
        console.warn(
          "Không thể xác minh mã giảm giá khi giỏ hàng thay đổi:",
          err
        );
        clearPromotion();
      }
    };
    validatePromotionOnCartChange();
  }, [cartCount]);

  useEffect(() => {
    updateCartCount();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        updateCartCount,
        getCartItemQuantity,
        discount,
        appliedPromotion,
        applyPromotion,
        clearPromotion,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
