import CancelOrderModal from "@/components/admin/order/CancelOrderModal";
import { addToCart } from "@/utils/addToCartHandler";
import { RotateCcw, XCircle, MessageCircle, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderActions({
  status = "pending",
  onOrderCancel,
  isCancelled,
  orderItems = [],
}) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleReorder = async () => {
    if (!orderItems.length) {
      alert("Không có sản phẩm nào để đặt lại");
      return;
    }
    for (const item of orderItems) {
      await addToCart({
        product: {
          _id: item.productId || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        },
        quantity: item.quantity,
      });
    }
    alert("Tất cả sản phẩm đã được thêm lại vào giỏ hàng!");
    navigate("/cart");
  };

  const handleContact = () => {
    alert("Đang phát triển");
    // TODO: mở modal/chat hoặc điều hướng
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold mb-2">Thao tác</h2>

      {isCancelled ? (
        <>
          <button
            onClick={handleReorder}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại đơn hàng
          </button>
          <button
            onClick={handleContact}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            <MessageCircle className="w-4 h-4" />
            Liên hệ hỗ trợ
          </button>
        </>
      ) : status === "pending" ? (
        <>
          <button
            onClick={() => setCancelModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            <XCircle className="w-4 h-4" />
            Hủy đơn hàng
          </button>
          <button
            onClick={handleReorder}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại đơn hàng
          </button>
          <button
            onClick={handleContact}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            <MessageCircle className="w-4 h-4" />
            Liên hệ hỗ trợ
          </button>
        </>
      ) : (
        <button
          onClick={handleContact}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <MessageCircle className="w-4 h-4" />
          Liên hệ hỗ trợ
        </button>
      )}

      <button
        onClick={() => navigate("/")}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
      >
        <Home className="w-4 h-4" />
        Về trang chủ
      </button>
      {cancelModalOpen && (
        <CancelOrderModal
          onClose={() => setCancelModalOpen(false)}
          onConfirm={async (reason) => {
            try {
              await onOrderCancel(reason);
              alert("Đơn hàng đã được hủy thành công!");
            } catch (err) {
              alert("Hủy đơn hàng thất bại!");
            } finally {
              setCancelModalOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
