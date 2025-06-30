import api from "@/utils/axiosInstance";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImages } from "@/utils/uploadImages";

export default function ProductReview() {
  const { id } = useParams();
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [images, setImages] = useState({});
  const [order, setOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${id}`);
        console.log(res.data);
        setOrder(res.data);
      } catch (err) {
        console.error("Không thể tải đơn hàng", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleImageUpload = async (id, e) => {
    const files = Array.from(e.target.files);
    try {
      const urls = await uploadImages(files);
      setImages((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), ...urls],
      }));
    } catch (err) {
      alert("Lỗi khi upload ảnh. Vui lòng thử lại.");
    }
  };
  const handleRatingChange = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };
  const handleReviewChange = (id, value) => {
    setReviews({ ...reviews, [id]: value });
  };

  const submitReviews = async () => {
    setIsSubmitting(true);
    try {
      for (const product of order.items) {
        await api.post("/api/reviews", {
          product: product.id,
          order: product.id,
          rating: ratings[product.id],
          comment: reviews[product.id] || "",
          images: images[product.id] || [],
        });
      }
      alert("Đã gửi toàn bộ đánh giá!");
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      alert(err?.response?.data?.message || "Lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <p className="text-center py-10">Đang tải đơn hàng...</p>;

  if (!order) {
    return (
      <div className="text-center py-10 text-red-500">
        Không tìm thấy đơn hàng
      </div>
    );
  }
  const canSubmit = order.items.every((p) => ratings[p.id] > 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 mt-[200px]">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Đánh giá sản phẩm</h1>
        <span className="text-green-600 text-sm font-medium">Đã giao hàng</span>
      </div>

      <div className="bg-white border rounded shadow p-4">
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-medium">Đơn hàng {order.orderId}</p>
            <p className="text-sm text-gray-500">
              Ngày đặt hàng: {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tổng tiền</p>
            <p className="text-green-600 font-semibold text-lg">
              {order.total_price}đ
            </p>
          </div>
        </div>

        {order.items.map((p) => (
          <div key={p.id} className="flex items-start gap-4 py-4 border-t">
            <image
              src={p.image}
              alt={p.name}
              width={80}
              height={80}
              className="rounded border"
            />
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">SL: {p.quantity}</p>
              <p className="text-sm font-semibold text-green-600">
                {p.price} đ
              </p>

              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleRatingChange(p.id, s)}
                    className={`text-xl ${
                      s <= (ratings[p.id] || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                className="mt-3 w-full border rounded p-2 text-sm"
                rows={3}
                placeholder="Viết cảm nhận của bạn..."
                value={reviews[p.id] || ""}
                onChange={(e) => handleReviewChange(p.id, e.target.value)}
              ></textarea>

              <div className="mt-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(p.id, e)}
                />
                <div className="flex gap-2 mt-2">
                  {(images[p.id] || []).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="preview"
                      width={60}
                      height={60}
                      className="rounded border object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="bg-white border rounded shadow p-4">
        <h2 className="font-medium mb-2">Đánh giá tổng thể đơn hàng</h2>

        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setOverallRating(s)}
              className={`text-2xl ${
                s <= overallRating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={4}
          placeholder="Cảm nhận về dịch vụ, giao hàng..."
          value={overallReview}
          onChange={(e) => setOverallReview(e.target.value)}
        ></textarea>
      </div> */}

      <div className="flex justify-end gap-4">
        <button
          className="px-6 py-2 border rounded"
          onClick={() => navigate("/order-manage")}
        >
          Để sau
        </button>
        <button
          onClick={submitReviews}
          disabled={!canSubmit || isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
}
