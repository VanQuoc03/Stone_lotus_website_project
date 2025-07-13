import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import dayjs from "@/utils/dayjsSetup";
import useLike from "@/hooks/useLike";
import CommentListAdmin from "@/components/admin/comments/CommentListAdmin";
import EditCareGuideButton from "@/components/admin/care-guide/EditCareGuideButton";

export default function AdminCareGuideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { likeCount } = useLike({ targetId: id, targetType: "BlogPost" });

  const fetchPost = async () => {
    try {
      const res = await api.get(`/api/blog/posts/${id}`);
      setPost(res.data.post || res.data);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc muốn xoá bài viết này không?")) {
      try {
        await api.delete(`/api/blog/posts/${id}`);
        navigate("/admin/care-guides");
      } catch (err) {
        alert("Xoá thất bại: " + err.message);
      }
    }
  };

  useEffect(() => {
    fetchPost();
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!post) return <div className="p-6">Đang tải bài viết...</div>;
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <Link
        to="/admin/care-guides"
        className="inline-flex items-center text-sm text-blue-600 hover:underline"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Quay lại danh sách
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {post.title}
          </h1>
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {dayjs(post.created_at).format("DD/MM/YYYY")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime || "?"} phút
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views || 0} lượt xem
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likeCount || 0} lượt thích
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <EditCareGuideButton guide={post} onSuccess={fetchPost} />
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 flex items-center gap-1 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Xoá
          </button>
        </div>
      </div>

      <img
        src={post.image || "https://via.placeholder.com/600x300"}
        alt={post.title}
        className="w-full h-80 object-cover rounded-md"
      />

      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CommentListAdmin comments={comments} onReload={fetchPost} />
    </div>
  );
}
