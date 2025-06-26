import useLikeCount from "@/hooks/useLikeCount";
import dayjs from "dayjs";
import {
  CalendarDays,
  Clock,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const likeCount = useLikeCount(post._id, "BlogPost");
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden md:flex"
      onClick={() => navigate(`/care-guide/${post._id}`)}
    >
      <div className="md:w-1/3 h-52 md:h-auto">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
              {post.type || "Chăm sóc"}
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <CalendarDays className="w-4 h-4" />
              {dayjs(post.created_at).format("DD/MM/YYYY")}
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600 cursor-pointer">
            {post.title}
          </h3>
          <p className="text-gray-600 mt-2 line-clamp-2">
            {post.excerpt || post.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <span className="font-medium">{post.author || "Admin"}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentCount || 0}</span>
            </div>
            {/* <Share2 className="w-4 h-4 cursor-pointer" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
