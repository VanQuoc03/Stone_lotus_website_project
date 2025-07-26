import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "../../components/cart/OrderSummary";
import { ShoppingBag, Truck, Shield } from "lucide-react";
import { toast } from "react-toastify";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { updateCartCount } = useCart();

  const fetchCart = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.warn("Bạn cần đăng nhập để xem giỏ hàng!");
        navigate("/login");
        return;
      }
      const res = await api.get("/api/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
      toast.error(
        err.response?.data?.error || "Không thể tải giỏ hàng. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      toast.warn("Số lượng không thể nhỏ hơn 1!");
      return;
    }
    try {
      const res = await api.put("/api/cart/update", { productId, quantity });
      if (!res.data || !res.data.items) {
        throw new Error("Dữ liệu giỏ hàng không hợp lệ");
      }
      setCart(res.data);
      updateCartCount();
      const item = res.data.items.find(
        (i) => i.product && i.product._id === productId
      );
      if (!item) {
        toast.error("Sản phẩm không tồn tại trong giỏ hàng!");
        await fetchCart();
        return;
      }
      const stock = item.product.inventory
        ? item.product.inventory.quantity
        : 0;
      if (quantity >= stock) {
        toast.warn(`Sản phẩm này chỉ còn ${stock} trong kho!`);
      }
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      toast.error(
        err.response?.data?.error ||
          "Lỗi khi cập nhật số lượng. Vui lòng thử lại."
      );
      await fetchCart();
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/api/cart/remove/${productId}`);
      await fetchCart();
      updateCartCount();
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      toast.error(
        err.response?.data?.error || "Lỗi khi xóa sản phẩm. Vui lòng thử lại."
      );
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
            .filter(
              (item) =>
                item.product &&
                typeof item.product === "object" &&
                item.product._id
            )
            .map(({ product, quantity }) => (
              <CartItem
                key={product._id}
                product={product}
                quantity={quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                availableStock={
                  product.inventory ? product.inventory.quantity : 0
                }
              />
            ))}
        </div>

        <div className="space-y-6">
          <div>
            <OrderSummary items={cart.items} shippingFee={0} />
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
