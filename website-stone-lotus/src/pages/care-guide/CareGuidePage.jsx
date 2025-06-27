import api from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Search,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useLikeCount from "@/hooks/useLikeCount";
import PostCard from "@/components/blog/PostCard";

export default function CareGuidePage() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [popularPosts, setPopularPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get("/api/featured?type=blog&limit=3");
        setPopularPosts(res.data);
      } catch (err) {
        console.error("Lỗi lấy bài viết phổ biến", err);
      }
    };
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchPopular();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/blog/posts");
        setPosts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Lỗi lấy bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setFiltered(
      posts.filter((p) =>
        p.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, posts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 mt-[200px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Chăm sóc sen đá
            </h2>
            {/* <div className="space-x-2">
              <button className="px-4 py-2 rounded bg-green-100 text-green-700 font-medium">
                Mới nhất
              </button>
              <button className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium">
                Phổ biến
              </button>
            </div> */}
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-8">
              {filtered.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50">
                Xem thêm bài viết
              </button>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-12">
              Không có bài viết phù hợp.
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white p-4 rounded shadow-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Popular Posts */}
          <div className="bg-white p-4 rounded shadow-md">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
              Bài viết phổ biến
            </h4>
            <div className="space-y-4">
              {popularPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center space-x-3 hover:bg-green-50 p-2 rounded cursor-pointer"
                  onClick={() => navigate(`/care-guide/${post._id}`)}
                >
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
