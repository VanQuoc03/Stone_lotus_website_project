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
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [paymentMethod, setPaymenMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState({
    cities: [],
    districts: [],
    wards: [],
  });
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

    setFormData((prev) => {
      let newForm = { ...prev, [name]: value };

      if (name === "cityCode") {
        newForm = { ...newForm, districtCode: "", wardCode: "" };
      } else if (name === "districtCode") {
        newForm = { ...newForm, wardCode: "" };
      }

      return newForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPlacingOrder) return;

    setIsPlacingOrder(true);
    try {
      const { cities, districts, wards } = locationData;

      const cityName =
        cities.find((c) => String(c.code) === String(formData.cityCode))
          ?.name || "";

      const districtName =
        districts.find((d) => String(d.code) === String(formData.districtCode))
          ?.name || "";

      const wardName =
        wards.find((w) => String(w.code) === String(formData.wardCode))?.name ||
        "";

      const shippingInfoToSubmit = {
        ...formData,
        city: cityName,
        district: districtName,
        ward: wardName,
      };

      const res = await api.post("/api/orders", {
        shippingInfo: shippingInfoToSubmit,
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
    } finally {
      setIsPlacingOrder(false);
    }
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
                setLocationData={setLocationData}
              />
              <PaymentMethodSelector
                selected={paymentMethod}
                onChange={setPaymenMethod}
              />
            </div>
            <div className="lg:col-span-1">
              <CheckoutSummary
                cartItems={cartItems}
                onSubmit={handleSubmit}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
