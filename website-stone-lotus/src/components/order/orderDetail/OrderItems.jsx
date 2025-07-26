import React from "react";

export default function OrderItems({
  items = [],
  subtotal,
  totalPrice,
  shippingFee,
  discount_amount,
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Sản phẩm đã đặt</h2>
      <div className="border rounded-lg overflow-hidden">
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex items-center p-4 gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  SL: {item.quantity} x {formatPrice(item.price)}
                </p>
              </div>
              <div className="font-semibold text-right">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 p-4 font-medium text-gray-600">
          <div className="flex justify-between font-semibold border-t ">
            <span className="">Tạm tính:</span>
            <span>{subtotal.toLocaleString("vi-VN")}₫</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Phí vận chuyển:</span>
            <span>
              {" "}
              {shippingFee > 0
                ? shippingFee.toLocaleString("vi-VN") + "₫"
                : "Miễn phí"}
            </span>
          </div>
          <div className="flex justify-between font-semibold ">
            <span className="">Giảm giá:</span>
            <span className="text-red-500">
              -{discount_amount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-4">
          <div className="flex justify-between font-semibold border-t">
            <span>Tổng cộng:</span>
            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
