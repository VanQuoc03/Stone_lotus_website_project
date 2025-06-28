import { useEffect, useState } from "react";
import InputField from "../../../components/Auth/InputField";
import SocialButton from "../../../components/Auth/SocialButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useCart } from "@/context/CartContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error, getUser, isAdmin } = useAuth();
  const { updateCartCount } = useCart();
  const { loginWithGoogle } = useGoogleAuth();

  useEffect(() => {
    const user = getUser();
    if (user) {
      if (isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate, getUser, isAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success && result.token) {
      try {
        await updateCartCount();

        const decoded = jwtDecode(result.token);

        if (decoded.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Decode error:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-6 sm:py-10 md:py-16">
      <div className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[450px]">
        {/* Logo/Avatar */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-purple-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
          {/* Header */}
          <div className="mb-5 sm:mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Đăng nhập
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Đăng nhập để tiếp tục
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              }
            />
            <InputField
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              }
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </InputField>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center h-11"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-5 sm:mt-6">
            <div className="relative flex items-center justify-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 sm:mx-4 text-xs text-gray-400">
                Hoặc đăng nhập với
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <SocialButton
                label="Google"
                icon={
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                }
                className="py-2.5 w-full"
                onClick={() => loginWithGoogle()}
              />

              <SocialButton
                label="Facebook"
                icon={
                  <svg
                    className="h-5 w-5 mr-2 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                }
                className="py-2.5 w-full"
              />
            </div>
          </div>

          {/* Login Link */}
          <p className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to={"/register"}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
