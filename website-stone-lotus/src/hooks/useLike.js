import { useState, useEffect } from "react";
import api from "@/utils/axiosInstance";

export default function useLike({
  targetId,
  targetType,
  initialLiked = false,
  initialCount = 0,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const countRes = await api.get("/api/likes/count", {
          params: { targetId, targetType },
        });
        setLikeCount(countRes.data.count);

        const likedRes = await api.get("/api/likes/check", {
          params: { targetId, targetType },
        });
        setLiked(likedRes.data.liked);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu like:", error);
      }
    };
    fetchLikeData();
  }, [targetId, targetType]);

  const toggleLike = async () => {
    try {
      if (liked) {
        await api.delete("/api/likes", {
          data: { targetId, targetType },
        });
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await api.post("/api/likes", { targetId, targetType });
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý like:", error);
    }
  };

  return { liked, likeCount, toggleLike };
}
