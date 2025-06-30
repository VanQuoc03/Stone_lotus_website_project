import React, { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orderAPI";
import {
  X,
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Search,
} from "lucide-react";

export default function PurchaseHistoryModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const rawOrders = await getMyOrders();

      const formatShipping = (info) => {
        if (!info) return "";
        return `${info.address}, ${info.ward}, ${info.district}, ${info.city}`;
      };

      const ordersFormatted = rawOrders.map((order) => ({
        id: order._id,
        orderNumber: order._id.slice(-6).toUpperCase(),
        date: order.createdAt,
        status: order.status,
        total: order.total_price,
        items:
          order.items?.map((item) => ({
            id: item._id,
            name: item.name,
            image: item.product?.images?.[0]?.image_url || "/placeholder.svg",
            price: item.price,
            quantity: item.quantity,
            variant: item.variant,
          })) || [],
        shippingAddress: formatShipping(order.shipping_address),
        paymentMethod: order.payment_method,
      }));

      setOrders(ordersFormatted);
    } catch (error) {
      console.error("Không thể tải lịch sử đơn hàng", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const statusConfig = {
    pending: {
      label: "Chờ xử lý",
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },
    confirmed: {
      label: "Đã xác nhận",
      color: "bg-indigo-100 text-indigo-700",
      icon: CheckCircle,
    },
    processing: {
      label: "Đang xử lý",
      color: "bg-blue-100 text-blue-700",
      icon: Package,
    },
    shipped: {
      label: "Đang giao",
      color: "bg-purple-100 text-purple-700",
      icon: Truck,
    },
    completed: {
      label: "Hoàn tất",
      color: "bg-green-200 text-green-800",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Đã hủy",
      color: "bg-red-100 text-red-700",
      icon: AlertCircle,
    },
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Lịch sử mua hàng
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Orders List */}
          <div className="w-1/2 border-r">
            {/* Search and Filter */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex gap-3 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="overflow-y-auto h-full">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Không có đơn hàng nào</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedOrder?.id === order.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              statusConfig[order.status].color
                            }`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[order.status].label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            {order.items.length} sản phẩm
                          </p>
                          <p className="font-bold text-blue-600">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="w-1/2">
            {selectedOrder ? (
              <div className="h-full overflow-y-auto">
                {/* Order Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {selectedOrder.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                        statusConfig[selectedOrder.status].color
                      }`}
                    >
                      {React.createElement(
                        statusConfig[selectedOrder.status].icon,
                        { className: "h-4 w-4" }
                      )}
                      {statusConfig[selectedOrder.status].label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span className="font-medium">
                        {formatDate(selectedOrder.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Thanh toán:</span>
                      <span className="font-medium">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Sản phẩm đã đặt
                  </h4>

                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 border rounded-lg"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          {item.variant && (
                            <p className="text-sm text-gray-600">
                              {item.variant}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              Số lượng: {item.quantity}
                            </span>
                            <span className="font-semibold text-blue-600">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Địa chỉ giao hàng
                    </h4>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                      {selectedOrder.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Chọn một đơn hàng để xem chi tiết
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
