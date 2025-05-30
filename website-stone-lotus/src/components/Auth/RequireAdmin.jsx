import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Dùng đúng cú pháp cho ESM
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.warning("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
    } else {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== "admin") {
          toast.error("Bạn không có quyền truy cập trang quản trị.");
        }
      } catch (err) {
        toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      }
    }
  }, [token]);

  // if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      toast.error("Bạn không có quyền truy cập trang quản trị.");
      return <Navigate to="/" />;
    }
    return children;
  } catch (err) {
    toast.error("Bạn không có quyền truy cập trang quản trị.");
    return <Navigate to="/" />;
  }
}
