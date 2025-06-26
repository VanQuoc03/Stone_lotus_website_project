import { useState } from "react";
import { User } from "lucide-react";
import dayjs from "@/utils/dayjsSetup";
import LikeButton from "@/components/like/LikeButton";
import api from "@/utils/axiosInstance";

export default function CommentItem({
  comment,
  postId,
  replyingTo,
  setReplyingTo,
  onReplied,
}) {
  const replies = comment.replies || [];
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const repliesToShow = showAllReplies ? replies : replies.slice(0, 2);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!replyText.trim()) return;

    try {
      await api.post(
        `/api/blog/comments/${comment._id}/reply`,
        { comment: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setReplyingTo(null);
      onReplied();
    } catch (error) {
      console.error("Lỗi gửi phản hồi:", error);
    }
  };

  return (
    <div key={comment._id} className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
        <User className="w-4 h-4" />
        <span>{comment.user?.name || "Người dùng"}</span>
        <span className="ml-auto text-xs text-gray-400">
          {dayjs(comment.created_at).fromNow()}
        </span>
      </div>

      <p className="text-gray-800 mb-2">{comment.comment}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
        <LikeButton postId={comment._id} targetType="BlogComment" />
        <button onClick={() => setReplyingTo(comment._id)}>Trả lời</button>
      </div>

      {replyingTo === comment._id && (
        <form onSubmit={handleReplySubmit} className="mt-2 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Phản hồi..."
            rows={2}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Gửi phản hồi
          </button>
        </form>
      )}

      {repliesToShow.map((r) => (
        <div
          key={r._id}
          className="ml-6 mt-2 p-2 border-l-2 border-green-200 bg-gray-50 rounded"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{r.user?.name || "Người dùng"}</span>
            <span className="ml-auto text-xs text-gray-400">
              {dayjs(r.created_at).fromNow()}
            </span>
          </div>
          <p className="text-gray-700 mt-1">{r.comment}</p>
        </div>
      ))}

      {replies.length > 2 && (
        <button
          onClick={() => setShowAllReplies(!showAllReplies)}
          className="text-sm text-blue-600 mt-2 ml-6 hover:underline"
        >
          {showAllReplies
            ? "Ẩn bớt phản hồi"
            : `Xem thêm ${replies.length - 2} phản hồi`}
        </button>
      )}
    </div>
  );
}
