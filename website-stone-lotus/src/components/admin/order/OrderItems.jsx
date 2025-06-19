import React from "react";

export default function OrderItems({
  items,
  subtotal,
  totalPrice,
  shippingFee,
  isCancelled,
}) {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h2 className="text-lg font-semibold mb-4">
        Sản phẩm đặt hàng{" "}
        {isCancelled && <span className="text-gray-500">(Đã hủy)</span>}
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between border rounded-lg p-4 ${
              isCancelled ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Số lượng: {item.quantity} &times;{" "}
                  {item.price.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
            <div
              className={`text-right font-semibold ${
                isCancelled ? "text-gray-600 line-through" : "text-gray-800"
              }`}
            >
              {(item.price * item.quantity).toLocaleString("vi-VN")}₫
            </div>
          </div>
        ))}
        <div className="space-y-2">
          <div className="flex justify-between text-sm border-t pt-4 mt-4 font-medium text-gray-600">
            <span className="">Tạm tính:</span>
            <span className={`${isCancelled ? "line-through" : ""}`}>
              {subtotal.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-600">Phí vận chuyển: </span>
            <span
              className={`text-gray-600 ${isCancelled ? "line-through" : ""}`}
            >
              {" "}
              {shippingFee > 0
                ? shippingFee.toLocaleString("vi-VN") + "₫"
                : "Miễn phí"}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-medium">
            <span>Tổng tiền</span>
            <span
              className={`${
                isCancelled ? "text-red-600 line-through" : "text-green-600"
              }`}
            >
              {(totalPrice || 0).toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
