import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import ShippingInfoForm from "@/components/checkout/ShippingInfoForm";
import api from "@/utils/axiosInstance";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  });
  const [paymentMethod, setPaymenMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/cart");
        setCartItems(res.data.items);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/orders", {
        shippingInfo: formData,
        paymentMethod,
      });
      console.log(res.data);
      alert("Đặt hàng thành công!");
      navigate(`/thank-you/${res.data.orderId}`);
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert(
        error.response?.data?.message ||
          "Đặt hàng thất bại. Vui lòng thử lại sau."
      );
    }
    console.log("Đặt hàng với thông tin:", formData, paymentMethod, cartItems);
  };
  return (
    <div className="mt-[200px] min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại giỏ hàng</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">Đang tải giỏ hàng...</div>
        ) : (
          <form
            action=""
            onSubmit={handleSubmit}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <ShippingInfoForm
                formData={formData}
                onChange={handleInputChange}
              />
              <PaymentMethodSelector
                selected={paymentMethod}
                onChange={setPaymenMethod}
              />
            </div>
            <div className="lg:col-span-1">
              <CheckoutSummary cartItems={cartItems} onSubmit={handleSubmit} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
