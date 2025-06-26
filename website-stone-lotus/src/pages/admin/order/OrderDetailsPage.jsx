import CancelBanner from "@/components/admin/order/CancelBanner";
import CustomerInfo from "@/components/admin/order/CustomerInfo";
import OrderActions from "@/components/admin/order/OrderActions";
import OrderItems from "@/components/admin/order/OrderItems";
import OrderTimeline from "@/components/admin/order/OrderTimeline";
import PaymentInfo from "@/components/admin/order/PaymentInfo";
import ShippingAddress from "@/components/admin/order/ShippingAddress";
import useOrderDetails from "@/hooks//useOrderDetails";
import api from "@/utils/axiosInstance";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const statusColorMap = {
  pending: "text-yellow-600",
  processing: "text-blue-600",
  delivered: "text-green-600",
  cancelled: "text-red-600",
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { order, loading, error, updateStatus, cancelOrder } =
    useOrderDetails(id);

  if (!id) return;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(res.data);
      } catch (error) {
        setError("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!order) return null;
  const subtotal = (order.items || []).reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const totalPrice = order.total_price || 0;
  const shippingFee = totalPrice - subtotal;
  const isCancelled = order.status === "cancelled";
  const statusClass = statusColorMap[order.status] || "text-gray-600";

  const orderId = id;
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer px-4 py-4 hover:bg-gray-100 rounded"
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn hàng #{order.orderId?.slice(-6).toUpperCase()}
            </h1>
            <p className={`text-sm font-medium ${statusClass} mt-1`}>
              Trạng thái: {order.status}
            </p>
            <span className="text-sm text-gray-500">
              Tạo lúc {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        </div>

        {isCancelled && (
          <CancelBanner
            cancelledAt={order.cancelledAt}
            cancelledBy={order.cancelledBy}
            reason={order.cancelReason}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <OrderItems
              subtotal={subtotal}
              items={order.items || []}
              shippingFee={shippingFee}
              totalPrice={totalPrice}
              isCancelled={order.status === "cancelled"}
            />
            <OrderTimeline timeline={order.timeline} />
          </div>
          <div className="space-y-6">
            <CustomerInfo customer={order.shippingInfo} />
            <ShippingAddress address={order.shippingInfo} />
            <PaymentInfo
              paymentMethod={order.paymentMethod}
              totalPrice={totalPrice}
              isCancelled={order.status === "cancelled"}
            />
            <OrderActions
              orderCode={order.orderId?.slice(-6).toUpperCase()}
              currentStatus={order.status}
              onStatusUpdate={updateStatus}
              onPrint={() => window.print()}
              onEmail={() => alert("Gửi email")}
              onOrderCancel={cancelOrder}
              isCancelled={order.status === "cancelled"}
              cancelledAt={order.cancelledAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
