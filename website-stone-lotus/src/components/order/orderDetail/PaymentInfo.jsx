import { CreditCard } from "lucide-react";

export default function PaymentInfo({ method = "cod", status = "pending" }) {
  const getMethodText = () => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "bank":
        return "Chuyển khoản ngân hàng";
      default:
        return method;
    }
  };

  const getStatusBadge = () => {
    if (status === "cancelled") {
      return (
        <span className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded">
          Đã hủy
        </span>
      );
    }

    return (
      <span className="text-sm font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
        Đã thanh toán
      </span>
    );
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5" />
        Thông tin thanh toán
      </h2>

      <div className="text-sm text-gray-700 space-y-3">
        <div className="flex justify-between">
          <span>Phương thức:</span>
          <span className="font-medium">{getMethodText()}</span>
        </div>

        <div className="flex justify-between">
          <span>Trạng thái:</span>
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
}
