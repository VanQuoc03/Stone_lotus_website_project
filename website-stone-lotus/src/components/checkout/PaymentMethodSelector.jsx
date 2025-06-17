import React from "react";
import { Truck, CreditCard } from "lucide-react";
export default function PaymentMethodSelector({ selected, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-green-600" />
        Phương thức thanh toán
      </h2>
      <div>
        <PaymentOption
          value="cod"
          selected={selected}
          onChange={onChange}
          icon={<Truck className="w-5 h-5 text-gray-600" />}
          title="Thanh toán khi nhận hàng (COD)"
          description="Thanh toán bằng tiền mặt khi nhận hàng"
        />
        <PaymentOption
          value="bank"
          selected={selected}
          onChange={onChange}
          icon={<CreditCard className="w-5 h-5 text-gray-600" />}
          title="Chuyển khoản ngân hàng"
          description="Chuyển khoản trước khi nhận hàng"
        />
      </div>
      {selected === "bank" && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p>
            {" "}
            <strong>Ngân hàng:</strong> Vietcombank
          </p>
          <p>
            {" "}
            <strong>Số tài khoản:</strong> 1234567890
          </p>
          <p>
            <strong>Chủ tài khoản:</strong> Cửa hàng Sen Đá
          </p>
          <p>
            <strong>Nội dung:</strong> Thanh toán đơn hàng [Mã đơn hàng]
          </p>
        </div>
      )}
    </div>
  );
}

function PaymentOption({
  value,
  selected,
  onChange,
  icon,
  title,
  description,
}) {
  return (
    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        name="payment"
        value={value}
        checked={selected === value}
        onChange={(e) => onChange(e.target.value)}
        className="w-4 h-4 text-green-600"
      />
      <div className="ml-3 flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </label>
  );
}
