import { useState } from "react";
import dayjs from "@/utils/dayjsSetup";
import api from "@/utils/axiosInstance";
import { MessageCircle } from "lucide-react";

export default function CommentListAdmin({ comments = [], onReload }) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xoá bình luận này không?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/blog/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onReload?.();
    } catch (err) {
      alert("Xoá bình luận thất bại!");
      console.error(err);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyContent.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/api/blog/comments/${parentId}/reply`,
        { comment: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyingTo(null);
      setReplyContent("");
      onReload?.();
    } catch (err) {
      alert("Gửi phản hồi thất bại");
      console.error(err);
    }
  };

  return (
    <div className="pt-8 border-t">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
        <MessageCircle className="w-5 h-5" />
        Bình luận ({comments?.length || 0})
      </h3>

      {comments.length > 0 ? (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="border rounded p-3 bg-white">
              <div className="text-sm text-gray-800 font-medium">
                {c.user?.name || "Ẩn danh"}
              </div>
              <div className="text-gray-700">{c.comment}</div>
              <div className="text-xs text-gray-400">
                {dayjs(c.createdAt).format("HH:mm DD/MM/YYYY")}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Xoá
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(c._id);
                    setReplyContent("");
                  }}
                  className="text-blue-600 text-xs hover:underline"
                >
                  Trả lời
                </button>
              </div>

              {replyingTo === c._id && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border rounded text-sm mb-2"
                    rows={2}
                    placeholder="Nhập phản hồi của bạn..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(c._id)}
                      className="text-white bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded"
                    >
                      Gửi phản hồi
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="text-gray-600 text-sm hover:underline"
                    >
                      Huỷ
                    </button>
                  </div>
                </div>
              )}

              {/* REPLIES */}
              {c.replies && c.replies.length > 0 && (
                <ul className="mt-2 pl-4 border-l border-gray-200 space-y-2 bg-gray-50 rounded">
                  {c.replies.map((reply) => (
                    <li key={reply._id} className="p-2">
                      <div className="text-sm font-medium text-gray-700">
                        {reply.user?.name || "Ẩn danh"}
                      </div>
                      <div className="text-gray-600">{reply.comment}</div>
                      <div className="text-xs text-gray-400">
                        {dayjs(reply.createdAt).format("HH:mm DD/MM/YYYY")}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">Chưa có bình luận nào.</p>
      )}
    </div>
  );
}
