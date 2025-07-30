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
    cityCode: "", // ✅ THÊM DÒNG NÀY
    districtCode: "", // ✅ THÊM DÒNG NÀY
    wardCode: "", // ✅ THÊM DÒNG NÀY
    note: "",
  });

  const [formError, setFormError] = useState({});
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
  const { updateCartCount, discount, appliedPromotion, clearPromotion } =
    useCart();
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,11}$/;

    if (!formData.fullName.trim()) errors.fullName = "Họ tên là bắt buộc";
    if (!formData.phone.trim()) {
      errors.phone = "Số điện thoại là bắt buộc";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.email) {
      errors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.address.trim()) errors.address = "Địa chỉ là bắt buộc";
    if (!formData.cityCode) errors.city = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.districtCode) errors.district = "Vui lòng chọn quận/huyện";
    if (!formData.wardCode) errors.ward = "Vui lòng chọn phường/xã";

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

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

    // Xóa lỗi của field đó nếu có
    setFormError((prev) => {
      const newErrors = { ...prev };
      // map lỗi field name với key trong formErrors
      const errorKeyMap = {
        cityCode: "city",
        districtCode: "district",
        wardCode: "ward",
      };
      const key = errorKeyMap[name] || name;
      if (newErrors[key]) {
        delete newErrors[key];
      }
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPlacingOrder) return;

    const isvalid = validateForm();
    if (!isvalid) return;

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
        promotionId: appliedPromotion?._id || null,
        discountAmount: discount || 0,
        appliedPromotionDetails: appliedPromotion
          ? {
              code: appliedPromotion.code,
              type: appliedPromotion.type,
              value: appliedPromotion.value,
            }
          : null,
      });

      console.log(res.data);
      alert("Đặt hàng thành công!");
      navigate(`/thank-you/${res.data.orderId}`);
      await updateCartCount();
      clearPromotion(); // <--- Thêm dòng này để xóa mã giảm giá sau khi đặt hàng
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
                formErrors={formError}
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
                discount={discount}
                appliedPromotion={appliedPromotion}
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
