import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function useLikeCount(targetId, targetType) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!targetId) return;
    const fetchCount = async () => {
      try {
        const res = await api.get("/api/likes/count", {
          params: { targetId, targetType },
        });
        setCount(res.data.count);
      } catch (err) {
        console.error("Lỗi lấy số like:", err);
      }
    };
    fetchCount();
  }, [targetId, targetType]);

  return count;
}
