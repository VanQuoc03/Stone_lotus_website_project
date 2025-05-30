import { useState } from "react";
import api from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUser = () => {
    const storedUser = localStorage.getItem("customer");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const isAdmin = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      return decoded.role === "admin" || decoded.isAdmin === true;
    } catch (error) {
      console.error("isAdmin() decode failed:", error);
      return false;
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Login response:", response.data);
      const { token, customer } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("customer", JSON.stringify(customer));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      return { success: true, user: customer, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Tài khoản hoặc mật khẩu không đúng";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    return { success: true };
  };
  return {
    login,
    logout,
    getUser,
    isLoading,
    error,
    isAdmin,
  };
}
