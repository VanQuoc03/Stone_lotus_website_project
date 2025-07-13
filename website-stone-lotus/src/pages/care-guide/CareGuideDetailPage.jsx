import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Link as LinkIcon,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Mail,
  User,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import LikeButton from "@/components/like/LikeButton";
import dayjs from "@/utils/dayjsSetup";
import CommentItem from "@/components/admin/care-guide/CommentItem";
import { shareContent } from "@/utils/share";
export default function CareGuideDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const fetchGuidesById = async () => {
    const res = await api.get(`/api/blog/posts/${id}`);
    console.log(res.data);
    setPost(res.data);
  };

  const handleShare = () => {
    if (shareContent) {
      shareContent({
        title: post.post.title,
        text: "Xem bài viết chia sẻ về sen đá",
        url: window.location.href,
      });
    } else {
      alert("Trình duyệt không hỗ trợ chia sẻ trực tiếp.");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchGuidesById();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/api/blog/posts/${post.post._id}/comments`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      const res = await api.get(`/api/blog/posts/${id}`);
      setPost(res.data);
    } catch (error) {}
  };

  if (!post)
    return (
      <div className="p-10 text-center text-gray-500">Đang tải bài viết...</div>
    );

  const repliesMap = {};
  post.comments.forEach((c) => {
    if (c.parent) {
      const key = c.parent.toString();
      if (!repliesMap[key]) repliesMap[key] = [];
      repliesMap[key].push(c);
    }
  });

  const totalComments =
    post.comments.length +
    post.comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);

  const topLevelComments = post.comments.filter((c) => !c.parent);
  const commentsToShow = showAllComments
    ? topLevelComments
    : topLevelComments.slice(0, 3);

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 max-w-6xl mx-auto mt-[200px]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            <button
              className="flex items-center gap-1 text-sm text-gray-600 hover:underline mb-4"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
            </button>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />{" "}
                {dayjs(post.post.created_at).format("DD/MM/YYYY")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {post.post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {post.post.views} lượt xem
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 leading-snug">
              {post.post.title}
            </h1>
          </div>

          <img
            src={post.post.image}
            alt={post.post.title}
            className="w-full h-96 object-cover rounded-lg"
          />

          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.post.content }}
          />

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-4">
              <LikeButton postId={id} targetType={"BlogPost"} />
              <button
                className="flex items-center gap-1 text-blue-600 hover:underline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
            </div>
            <div className="flex items-center text-gray-500 text-sm gap-2">
              <MessageCircle className="w-4 h-4" /> {totalComments} bình luận
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Bình luận ({totalComments})
            </h3>
            <form
              action=""
              onSubmit={handleCommentSubmit}
              className="mt-6 space-y-2 mb-4"
            >
              <textarea
                value={newComment}
                placeholder="Viết bình luận của bạn..."
                rows={3}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Gửi bình luận
              </button>
            </form>

            {commentsToShow.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                replies={repliesMap[comment._id] || []}
                postId={id}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                onReplied={fetchGuidesById}
              />
            ))}
            {topLevelComments.length > 3 && (
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showAllComments
                  ? "Ẩn bớt bình luận"
                  : `Xem thêm ${topLevelComments.length - 2} bình luận`}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 shadow rounded bg-white">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>

          <div className="p-4 shadow rounded text-white bg-gradient-to-br from-green-500 to-emerald-600">
            <h4 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h4>
            <p className="text-sm mb-4 opacity-90">
              Nhận bài viết mới nhất về chăm sóc sen đá
            </p>
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full px-4 py-2 mb-3 rounded bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none"
            />
            <button className="w-full bg-white text-green-600 font-medium py-2 rounded hover:bg-gray-100">
              <Mail className="w-4 h-4 inline mr-2" /> Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
