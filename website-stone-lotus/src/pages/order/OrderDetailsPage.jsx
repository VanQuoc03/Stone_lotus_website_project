import React, { useEffect, useState } from "react";
import OrderActions from "@/components/order/orderDetail/OrderActions";
import OrderItems from "@/components/order/orderDetail/OrderItems";
import OrderStatusBox from "@/components/order/orderDetail/OrderStatusBox";
import PaymentInfo from "@/components/order/orderDetail/PaymentInfo";
import ShippingInfo from "@/components/order/orderDetail/ShippingInfo";
import useOrderDetails from "@/hooks//useOrderDetails";
import { getOrderStatusMeta } from "@/shared/constants/orderStatus";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { order, loading, updateStatus, cancelOrder } =
    useOrderDetails(orderId);
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center pt-32">Đang tải đơn hàng...</div>;
  }

  if (!order) {
    return <div className="text-center pt-32">Không tìm thấy đơn hàng.</div>;
  }
  const { label, icon, color } = getOrderStatusMeta(order.status);
  const subtotal = (order.items || []).reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const totalPrice = order.total_price || 0;
  const shippingFee = totalPrice - subtotal;
  return (
    <div className="mt-[210px] pb-16 max-w-5xl mx-auto px-4">
      <div
        className="flex items-center gap-2 cursor-pointer py-2 hover:bg-gray-100 rounded"
        onClick={() => navigate("/order-manage")}
      >
        <ArrowLeft />
        Quay lại
      </div>
      <h1 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h1>

      <div className="flex items-center gap-2 mb-6">
        <span className={`text-sm font-medium ${color}`}>Mã đơn hàng:</span>
        <span className="text-gray-400 text-sm">
          #{orderId.slice(-6).toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderStatusBox
            status={order.status}
            createdAt={order.createdAt}
            timeline={order.timeline}
          />
          <OrderItems
            items={order.items}
            subtotal={subtotal}
            shippingFee={shippingFee}
            totalPrice={totalPrice}
          />
        </div>
        <div className="space-y-6">
          <ShippingInfo shippingInfo={order.shippingInfo} />
          <PaymentInfo method={order.paymentMethod} status={order.status} />
          <OrderActions
            orderCode={order.orderId?.slice(-6).toUpperCase()}
            currentStatus={order.status}
            onStatusUpdate={updateStatus}
            onOrderCancel={cancelOrder}
            isCancelled={order.status === "cancelled"}
            cancelledAt={order.cancelledAt}
            orderItems={order.items}
          />
        </div>
      </div>
    </div>
  );
}
