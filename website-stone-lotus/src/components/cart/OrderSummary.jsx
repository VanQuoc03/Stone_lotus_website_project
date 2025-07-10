import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight } from "lucide-react";

export default function OrderSummary({ items, shippingFee = 0 }) {
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [codeApplied, setCodeApplied] = useState(false);

  const subTotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  const total = subTotal - discount + shippingFee;

  const handleApplyCode = () => {
    if (discountCode.trim().toUpperCase() === "GIAM10") {
      const amount = Math.round(subTotal * 0.1);
      setDiscount(amount);
      setCodeApplied(true);
      toast.success("Áp dụng mã GIAM10 thành công!");
    } else {
      setDiscount(0);
      setCodeApplied(false);
      toast.error("Mã giảm giá không hợp lệ.");
    }
  };

  const format = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

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
          {codeApplied && (
            <div className="text-sm text-green-600">
              ✅ Mã <strong>GIAM10</strong> đã được áp dụng
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
              <span>Giảm giá (10%)</span>
              <span>-{format(discount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>
              {shippingFee === 0 ? (
                <span className="text-green-600 font-medium">Miễn phí</span>
              ) : (
                format(shippingFee)
              )}
            </span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between text-base font-semibold">
            <span>Tổng cộng</span>
            <span className="text-green-700">{format(total)}</span>
          </div>

          {shippingFee > 0 && (
            <p className="text-xs text-gray-600">
              Mua thêm <strong>{format(500000 - subTotal)}</strong> để được miễn
              phí vận chuyển
            </p>
          )}
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
