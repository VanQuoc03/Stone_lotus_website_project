import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SessionExpired() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow text-center max-w-md">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Phiên đăng nhập đã hết hạn
        </h2>
        <p className="text-gray-600">
          Bạn sẽ được chuyển về trang đăng nhập trong giây lát...
        </p>
        <p className="text-xs mt-2 text-gray-400">
          Nếu không được chuyển, hãy {" "}
          <a href="/login" className="text-blue-500 underline">
            bấm vào đây
          </a>
          .
        </p>
      </div>
    </div>
  );
}
