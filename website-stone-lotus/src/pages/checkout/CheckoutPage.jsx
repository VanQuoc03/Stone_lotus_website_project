import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import ShippingInfoForm from "@/components/checkout/ShippingInfoForm";
import api from "@/utils/axiosInstance";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

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
  const [shopInfo, setShopInfo] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const { updateCartCount } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/cart");
        if (buyNowItem) {
          const item = res.data.items.find(
            (i) => i.product && i.product._id === buyNowItem.productId
          );
          if (item) {
            setCartItems([
              { product: item.product, quantity: buyNowItem.quantity },
            ]);
          } else {
            // Nếu sản phẩm không có trong giỏ hàng, lấy thông tin từ API sản phẩm
            const productRes = await api.get(
              `/api/products/${buyNowItem.productId}`
            );
            setCartItems([
              { product: productRes.data, quantity: buyNowItem.quantity },
            ]);
          }
        } else {
          setCartItems(res.data.items);
        }
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
        cities.find((c) => String(c.ProvinceID) === String(formData.cityCode))
          ?.ProvinceName || "";

      const districtName =
        districts.find(
          (d) => String(d.DistrictID) === String(formData.districtCode)
        )?.DistrictName || "";

      const wardName =
        wards.find((w) => String(w.WardCode) === String(formData.wardCode))
          ?.WardName || "";

      const shippingInfoToSubmit = {
        ...formData,
        city: cityName,
        district: districtName,
        ward: wardName,
      };

      const itemsToSubmit = buyNowItem
        ? [
            {
              product: buyNowItem.productId,
              quantity: buyNowItem.quantity,
              variantId: buyNowItem.variantId,
            },
          ]
        : cartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            variantId: item.variantId,
          }));

      const res = await api.post("/api/orders", {
        shippingInfo: shippingInfoToSubmit,
        paymentMethod,
        items: itemsToSubmit,
        shippingFee,
        fromCart: !buyNowItem,
      });

      console.log(res.data);
      alert("Đặt hàng thành công!");
      navigate(`/thank-you/${res.data.orderId}`);
      await updateCartCount();
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
  
  //Hàm tính phí shipping
  const fetchShippingFee = async () => {
    if (!formData.districtCode || !formData.wardCode || !cartItems.length) {
      console.warn("Thiếu dữ liệu, chưa gọi GHN Fee API");
      return;
    }

    try {
      const res = await api.post("/api/shipping/calculate-fee", {
        districtCode: formData.districtCode,
        wardCode: formData.wardCode,
        cartItems,
      });
      const fee = res.data.shippingFee;
      console.log("Phí vận chuyển từ backend:", fee);
      setShippingFee(fee);
    } catch (err) {
      console.error("Lỗi khi gọi backend tính phí:", err);
      setShippingFee(0);
    }
  };

  useEffect(() => {
    fetchShippingFee();
  }, [formData.districtCode, formData.wardCode, cartItems, shopInfo]);

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
                shippingFee={shippingFee}
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
