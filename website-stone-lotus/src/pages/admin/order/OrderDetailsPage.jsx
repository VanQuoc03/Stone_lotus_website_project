import CustomerInfo from "@/components/admin/order/CustomerInfo";
import OrderActions from "@/components/admin/order/OrderActions";
import OrderItems from "@/components/admin/order/OrderItems";
import OrderTimeline from "@/components/admin/order/OrderTimeline";
import PaymentInfo from "@/components/admin/order/PaymentInfo";
import ShippingAddress from "@/components/admin/order/ShippingAddress";
import api from "@/utils/axiosInstance";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Order details:", res.data);
        setOrder(res.data);
      } catch (error) {
        setError("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);
  //   if (loading) return <div className="p-6">Đang tải...</div>;
  //   if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chi tiết đơn hàng #{order.orderId?.slice(-6).toUpperCase()}
          </h1>
          <span className="text-sm text-gray-500">
            Tạo lúc {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderItems
              items={order.items}
              total={order.items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              )}
            />
            <OrderTimeline timeline={order.timeline} />
          </div>
          <div className="space-y-6">
            <CustomerInfo customer={order.shippingInfo} />
            <ShippingAddress address={order.shippingInfo} />
            <PaymentInfo
              paymentMethod={order.paymentMethod}
              totalPrice={order.items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              )}
            />
            <OrderActions
              orderCode={order.orderId?.slice(-6).toUpperCase()}
              currentStatus={order.status}
              onStatusUpdate={async (newStatus) => {
                try {
                  await api.put(
                    `/api/orders/${order.orderId}/status`,
                    { status: newStatus },
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  setOrder({ ...order, status: newStatus });
                } catch (err) {
                  alert("Cập nhật thất bại");
                }
              }}
              onPrint={() => window.print()}
              onEmail={() => alert("Gửi email")}
              onCancel={() => alert("Hủy đơn hàng")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
