// pages/Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";
import {
  getGuestCart,
  updateGuestQuantity,
  removeGuestCart,
} from "@/utils/guestCart";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "../../components/cart/OrderSummary";
import { ShoppingBag, Truck, Shield } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { updateCartCount } = useCart();

  const fetchCart = async () => {
    setLoading(true);
    try {
      if (token) {
        const res = await api.get("/api/cart");
        setCart(res.data);
      } else {
        const guestCart = getGuestCart();
        setCart({
          items: guestCart.map((p) => ({ product: p, quantity: p.quantity })),
        });
      }
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      if (token) {
        await api.put("/api/cart/update", { productId, quantity });
      } else {
        updateGuestQuantity(productId, quantity);
      }
      fetchCart();
      updateCartCount();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      if (token) {
        await api.delete(`/api/cart/remove/${productId}`);
      } else {
        removeGuestCart(productId);
      }
      await fetchCart();
      updateCartCount();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 mt-[200px] flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-64 w-full max-w-md bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  if (!cart?.items || cart.items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6 mt-[200px]">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-6">
            Hãy thêm một số sen đá xinh đẹp vào giỏ hàng của bạn!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  return (
    <div className="max-w-6xl mx-auto p-6 mt-[200px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Giỏ hàng của bạn
        </h1>
        <p className="text-gray-600">
          {cart.items.length} sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items
            .filter((item) => item.product && item.product._id)
            .map(({ product, quantity }) => (
              <CartItem
                key={product._id}
                product={product}
                quantity={quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
        </div>

        <div className="space-y-6 ">
          <div>
            {" "}
            <OrderSummary items={cart.items} />
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Giao hàng nhanh</p>
                    <p className="text-xs text-gray-600">
                      Giao hàng trong 1-2 ngày
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Bảo hành cây</p>
                    <p className="text-xs text-gray-600">
                      Đổi trả trong 7 ngày
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="w-full border border-gray-300 bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
