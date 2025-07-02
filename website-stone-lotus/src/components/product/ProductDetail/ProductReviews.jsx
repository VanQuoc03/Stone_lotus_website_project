import api from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/api/reviews/product/${product._id}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Lỗi lấy review sản phẩm");
      }
    };
    if (product._id) fetchReviews();
  }, [product]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Nhận xét</h3>

      {reviews.length === 0 ? (
        <p className="italic text-gray-500">Chưa có nhận xét nào.</p>
      ) : (
        <div className="text-gray-700 text-sm space-y-2">
          {reviews.map((review, index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-semibold text-[#c29e6b]">
                {review.user?.name || "Khách"}
              </p>
              <p className="font-medium">
                ⭐ {review.rating} - {review.comment}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
