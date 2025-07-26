export default function CheckoutSummary({
  cartItems,
  onSubmit,
  isPlacingOrder,
  shippingFee,
  discount,
  appliedPromotion,
}) {
  const format = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item?.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = typeof shippingFee === "number" ? shippingFee : 0;
  const total = subtotal + shipping - discount; // Trừ đi giảm giá

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold mb-6">Tóm tắt đơn hàng</h2>

      {/* Danh sách sản phẩm */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item._id} className="flex items-center gap-3">
            <div className="relative">
              <img
                src={item.product?.images?.[0]?.image_url || "/placeholder.svg"}
                alt={item.product?.name || "Sản phẩm"}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.product?.name || "Tên sản phẩm"}
              </h4>
              <p className="text-sm text-gray-600">
                {item.product?.price?.toLocaleString("vi-VN") || "0"}đ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tính toán */}
      <div className="space-y-3 py-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium">{format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium">
            {shipping === 0 ? format(0) : format(shipping)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="text-gray-600">
              Giảm giá ({appliedPromotion?.code || ""})
            </span>
            <span className="font-medium">-{format(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-200">
          <span>Tổng cộng</span>
          <span className="text-green-600">{format(total)}</span>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isPlacingOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            "Đặt hàng ngay"
          )}
        </button>
      </div>
    </div>
  );
}
