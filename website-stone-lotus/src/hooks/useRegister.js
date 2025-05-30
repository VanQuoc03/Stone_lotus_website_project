import React, { useState } from "react";
import api from "../utils/axiosInstance";
export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/user/register", formData);
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.res?.data?.message || "Đăng ký thất bại";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
