import React, { useEffect, useState } from "react";
import { data } from "react-router-dom";

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("customer");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  useEffect(() => {
    if (product.id) {
      fetch(`http://localhost:3001/reviews?product_id${product.id}`)
        .then((res) => res.json())
        .then((data) => setReviews(data))
        .catch((error) => console.error("Lỗi tải nhận xét", error));
    }
  }, [product]);

  const handleReviewSubmit = () => {
    e.preventDefault();
    if (!user) return alert("Bạn cần đăng nhập để gửi nhận xét");
    if (newReview.trim()) {
      const review = {
        user_id: user.id,
        user_name: user.name,
        product_id: product.id,
        rating: newRating,
        comment: newReview.trim(),
        created_at: new Date().toISOString(),
      };
      fetch("http://localhost:3001/reviews", {
        method: "POST",
        headers: {
          "Context-Type": "application/json",
        },
        body: JSON.stringify(review),
      })
        .then((res) => res.json())
        .then((data) => {
          setReviews((prev) => [...prev, data]);
          setNewReview("");
          setNewRating(5);
        })
        .catch((error) => {
          console.error("Lỗi gửi nhận xét: ", error);
        });
    }
  };

  return (
    <div className="space-y-4">
      <form action="" className="space-y-2" onSubmit={handleReviewSubmit}>
        <textarea
          name=""
          id=""
          rows={3}
          placeholder="Viết nhận xét của bạn..."
          className="w-full text-sm rounded border border-gray-300 p-2 focus:outline-none focus:ring focus:border-[#c29e6b]"
        />
        <div className="flex items-center gap-3">
          <label htmlFor="rating" className="text-sm text-gray-700">
            Đánh giá:{" "}
          </label>
          <select
            name=""
            id="rating"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded text-sm"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} sao
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#c29e6b] rounded text-white hover:bg-[#b58a5c] text-sm"
        >
          Gửi nhận xét
        </button>
      </form>
      <div className="text-gray-700 text-sm space-y-2">
        {reviews.length === 0 ? (
          <p className="italic text-gray-500">Chưa có nhận xét nào.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-semibold text-[#c29e6b]">
                {review.user_name || "Khách"}
              </p>
              <p className="font-medium">
                ⭐ {review.rating} - {review.comment}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
