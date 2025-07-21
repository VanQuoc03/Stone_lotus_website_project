import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ShoppingBag,
  Home,
  FileText,
} from "lucide-react";
import api from "@/utils/axiosInstance";
import { getOrderStatusMeta } from "@/shared/constants/orderStatus";
export default function ThankYouPage() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { orderId } = useParams();
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        console.log("Order Details:", res.data);
        setOrderDetails(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-16 mt-[120px]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 p-8 text-center border-b">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Cảm ơn bạn đã đặt hàng!
            </h1>
            <p className="text-gray-600">
              Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>
            {orderId && (
              <div className="mt-4 bg-white rounded-md py-2 px-4 inline-block border border-gray-200">
                <span className="text-sm text-gray-500">Mã đơn hàng: </span>
                <span className="font-medium">
                  #{orderId.slice(-6).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            {orderDetails ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Thông tin đơn hàng
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Người nhận:</p>
                        <p className="font-medium">
                          {orderDetails.shippingInfo?.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại:</p>
                        <p className="font-medium">
                          {orderDetails.shippingInfo?.phone}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">
                          Địa chỉ giao hàng:
                        </p>
                        <p className="font-medium">
                          {orderDetails.shippingInfo?.address},{" "}
                          {orderDetails.shippingInfo?.ward},{" "}
                          {orderDetails.shippingInfo?.district},{" "}
                          {orderDetails.shippingInfo?.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Phương thức thanh toán:
                        </p>
                        <p className="font-medium">
                          {orderDetails.paymentMethod === "cod"
                            ? "Thanh toán khi nhận hàng"
                            : "Chuyển khoản ngân hàng"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái:</p>
                        {(() => {
                          const { label, icon, color } = getOrderStatusMeta(
                            orderDetails.status
                          );
                          return (
                            <p className={`font-medium ${color}`}>
                              <span className="mr-1">{icon}</span>
                              {label}
                            </p>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {orderDetails.items?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Sản phẩm đã đặt
                    </h2>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="divide-y">
                        {orderDetails.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center p-4 gap-4"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-500">
                                SL: {item.quantity || 0} x{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.price || 0)}
                              </p>
                            </div>
                            <div className="font-semibold">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(
                                (item.price || 0) * (item.quantity || 0)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-4">
                        <div className="flex justify-between font-semibold">
                          <span>Phí vận chuyển:</span>
                          <span>
                            {(orderDetails.shipping_fee || 0).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4">
                        <div className="flex justify-between font-semibold">
                          <span>Tổng cộng:</span>
                          <span>
                            {orderDetails.total_price.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ gửi email xác nhận đơn
                  hàng cho bạn trong thời gian sớm nhất.
                </p>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-semibold">Bước tiếp theo</h2>
              <p className="text-gray-600">
                Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao đi. Bạn
                cũng có thể kiểm tra trạng thái đơn hàng trong tài khoản của
                mình.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/products"
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Tiếp tục mua sắm</span>
                </Link>

                <Link
                  to={`/order/${orderId}`}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Xem đơn hàng của tôi</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
