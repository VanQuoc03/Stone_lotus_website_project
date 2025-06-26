import React from "react";
import useLike from "@/hooks/useLike";
import { Heart } from "lucide-react";

export default function LikeButton({ postId, targetType }) {
  const { liked, likeCount, toggleLike } = useLike({
    targetId: postId,
    targetType: targetType,
  });

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1 ${
        liked ? "text-red-600" : "text-gray-500"
      }`}
    >
      <Heart className="w-4 h-4" /> {likeCount}
    </button>
  );
}
