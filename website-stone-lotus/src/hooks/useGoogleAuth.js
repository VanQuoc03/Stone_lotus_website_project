import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import api from "@/utils/axiosInstance";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post("/auth/google", {
          token: tokenResponse.access_token,
        });

        const data = res.data;

        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          await updateCartCount();

          const decoded = jwtDecode(data.token);
          if (decoded.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } else {
          console.error("Google login backend error:", data.message);
        }
      } catch (error) {
        console.error("Google login error:", error);
      }
    },
    onError: () => {
      console.error("Google login thất bại");
    },
    flow: "implicit",
  });

  return { loginWithGoogle };
};
