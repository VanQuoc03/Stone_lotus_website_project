import { CreditCard } from "lucide-react";
import React from "react";

export default function PaymentInfo({
  paymentMethod,
  totalPrice,
  isCancelled,
}) {
  return (
    <div className="bg-white rounded-md shadow p-4">
      <div className="flex items-center gap-2 mb-3 font-bold text-2xl">
        {" "}
        <CreditCard />
        <span>Thông tin thanh toán</span>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-600">Phương thức:</span>
          <span className="capitalize font-medium">
            {paymentMethod === "bank"
              ? "Chuyển khoản"
              : paymentMethod === "cod"
              ? "COD"
              : paymentMethod}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Trạng thái:</span>
          {!isCancelled ? (
            <span className="inline-block rounded-full border border-green-300 bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
              Đã thanh toán
            </span>
          ) : (
            <span className="inline-block rounded-full border border-gray-100 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              Đã hủy
            </span>
          )}
        </div>
        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Tổng tiền:</span>
          {!isCancelled ? (
            <span className="text-green-600">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          ) : (
            <span className="text-red-600 line-through">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
