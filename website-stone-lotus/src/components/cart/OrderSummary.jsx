import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";
import api from "@/utils/axiosInstance";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";

export default function OrderSummary({ items, shippingFee = 0 }) {
  const navigate = useNavigate();
  const [suggestedCoupons, setSuggestedCoupons] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const { getUser } = useAuth();
  const user = getUser();
  const userId = user ? user.id : null;
  const [discountCode, setDiscountCode] = useState("");
  const [codeApplied, setCodeApplied] = useState(false);
  const {
    discount,
    applyPromotion,
    clearPromotion,
    appliedPromotion: contextAppliedPromotion,
  } = useCart();

  const subTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  const total = subTotal - discount + shippingFee;

  // Đồng bộ trạng thái mã giảm giá với CartContext
  useEffect(() => {
    if (!contextAppliedPromotion) {
      // Nếu mã giảm giá trong context bị xóa
      setDiscountCode("");
      setCodeApplied(false);
    } else if (contextAppliedPromotion.code !== discountCode) {
      // Nếu có mã giảm giá trong context và khác với mã hiện tại
      setDiscountCode(contextAppliedPromotion.code);
      setCodeApplied(true);
    }
    // Cập nhật trạng thái `codeApplied` dựa trên `discount` từ context
    // Điều này sẽ giúp hiển thị/ẩn gợi ý mã giảm giá chính xác hơn
    if (discount > 0 && contextAppliedPromotion) {
      setCodeApplied(true);
    } else {
      setCodeApplied(false);
    }
  }, [contextAppliedPromotion, discount]); // Theo dõi appliedPromotion và discount từ context

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get(
          `/api/promotions/suggestions?total=${subTotal}&user_id=${userId}`
        );
        console.log(res.data);
        setSuggestedCoupons(res.data || []);
      } catch (err) {
        console.error("Lỗi gợi ý mã giảm giá:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    if (userId && subTotal > 0) {
      fetchSuggestions();
    }
  }, [subTotal, userId]);

  const format = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleApplyCode = async () => {
    try {
      const res = await api.post("/api/promotions/apply", {
        code: discountCode,
        total: subTotal,
        user_id: userId,
      });

      applyPromotion(res.data.discount, res.data.promotion);
      setCodeApplied(true);
      toast.success(res.data.message || "Áp dụng mã thành công");
    } catch (err) {
      console.error("Lỗi áp mã:", err);
      toast.error(
        err.response?.data?.error || "Không thể áp dụng mã. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Mã giảm giá */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b font-semibold text-base">
          Mã giảm giá
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Nhập mã giảm giá"
              className="flex-1 border px-3 py-2 rounded-md"
              disabled={codeApplied}
            />
            <button
              onClick={handleApplyCode}
              disabled={codeApplied || !discountCode.trim()}
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-300 disabled:opacity-50"
            >
              Áp dụng
            </button>
          </div>

          {/* Gợi ý mã giảm giá */}
          {!codeApplied && suggestedCoupons.length > 0 && (
            <div className="space-y-2 text-sm text-gray-700 mt-2">
              <p className="text-xs text-gray-500">Gợi ý mã giảm giá:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedCoupons.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => {
                      setDiscountCode(c.code);
                      toast.info(`Đã chọn mã: ${c.code}`);
                    }}
                    className="px-2 py-1 border rounded text-green-700 border-green-500 hover:bg-green-100 text-xs font-mono"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="px-5 py-4 border-b font-semibold text-base">
          Tóm tắt đơn hàng
        </div>
        <div className="px-5 py-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{format(subTotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá ({discountCode})</span>
              <span>-{format(discount)}</span>
            </div>
          )}

          <hr className="my-2" />

          <div className="flex justify-between text-base font-semibold">
            <span>Tổng cộng</span>
            <span className="text-green-700">{format(total)}</span>
          </div>

          {/* {shippingFee > 0 && (
            <p className="text-xs text-gray-600">
              Mua thêm <strong>{format(500000 - subTotal)}</strong> để được miễn
              phí vận chuyển
            </p>
          )} */}
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-base font-semibold flex justify-center items-center transition"
      >
        Tiến hành thanh toán
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );
}
