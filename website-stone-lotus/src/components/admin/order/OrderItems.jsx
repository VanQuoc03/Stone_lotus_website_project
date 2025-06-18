import React from "react";

export default function OrderItems({ items, total }) {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Sản phẩm đặt hàng</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border rounded-lg p-4"
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
                  {item.price.toLocaleString("vi-VN")}₫;
                </p>
              </div>
            </div>
            <div className="text-right font-semibold text-gray-800">
              <p>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</p>
            </div>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-medium">
            <span>Tổng tiền</span>
            <span className="text-green-600">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
