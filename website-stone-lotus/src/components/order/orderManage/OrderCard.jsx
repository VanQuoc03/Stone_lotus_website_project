import { getOrderStatusMeta } from "@/shared/constants/orderStatus";
import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }) {
  const { label, icon, color } = getOrderStatusMeta(order.status);
  const navigate = useNavigate();
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  return (
    <div className="bg-white shadow rounded p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-semibold text-lg">#{order.id}</h3>
            <span className={`text-sm font-medium ${color}`}>
              {icon} {label}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Ngày đặt hàng</p>
              <p className="font-medium">
                {formatDate(order.createdAt || order.date)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng tiền</p>
              <p className="font-medium text-green-600">
                {formatPrice(order.total_price)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
            onClick={() => navigate(`/order/${order.id}`)}
          >
            Chi tiết
          </button>
          {order.status === "completed" && (
            <button
              className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
              onClick={() => navigate(`/order-review/${order.id}`)}
            >
              Đánh giá
            </button>
          )}
          <button
            className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
            onClick={() => alert("Đang phát triển")}
          >
            Hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
}
