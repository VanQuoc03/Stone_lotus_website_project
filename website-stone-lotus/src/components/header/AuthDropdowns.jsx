import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  FiLogOut,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import UserLogin from "../../assets/icon_header/UserLogin";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import SocialButton from "@/components/Auth/SocialButton";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

function AuthDropdowns() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const ref = useRef();
  const { login, logout, getUser, isLoading, error, isAdmin } = useAuth();
  const { updateCartCount } = useCart();
  const { loginWithGoogle } = useGoogleAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUser());

    const handleClickOutSide = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const handleLogout = () => {
    logout();

    setUser(null);
    setIsOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password, rememberMe);
    if (result.success) {
      setUser(result.user);
      setIsOpen(false);
      updateCartCount();

      if (isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
      setFormData({
        email: " ",
        password: " ",
      });
    }
  };

  const handleGoogleLogin = async () => {
    loginWithGoogle();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center justify-center text-white rounded p-2 hover:bg-[#3a7a6f] transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="mr-2 bg-[#2c5c53] p-1.5 rounded-full">
            <UserLogin />
          </div>
          <div className="hidden lg:block text-left text-sm">
            {user ? (
              <>
                <p className="text-xs opacity-90">Xin chào,</p>
                <p className="font-medium truncate max-w-[120px]">
                  {user.name || user.email}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs opacity-90">Đăng nhập/Đăng ký</p>
                <p className="font-medium">Tài khoản của tôi</p>
              </>
            )}
          </div>
          <IoIosArrowDown
            className={`hidden lg:block ml-1 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed lg:absolute right-0 top-[100px] lg:top-full lg:right-0 z-50 
                    w-[90%] sm:w-[400px] lg:w-[380px] mx-auto lg:mx-0
                    bg-white shadow-xl rounded-lg border border-gray-100
                    transform
                    animate-fadeIn"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {user ? (
            <div className="p-5">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-[#c29e6b] flex items-center justify-center text-white text-2xl font-bold">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="text-center mb-5">
                <h3 className="font-semibold text-lg text-gray-800">
                  {user.name || user.email}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-full py-2.5 px-4 bg-[#f8f4ee] hover:bg-[#f0e9db] text-[#c29e6b] rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="mr-2" />
                  Thông tin tài khoản
                </Link>

                <Link
                  to="/order-manage"
                  className="flex items-center justify-center w-full py-2.5 px-4 bg-[#f8f4ee] hover:bg-[#f0e9db] text-[#c29e6b] rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Đơn hàng của tôi
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                >
                  <FiLogOut className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="mb-4">
                <h2 className="font-semibold text-center text-lg text-gray-800 mb-1">
                  ĐĂNG NHẬP TÀI KHOẢN
                </h2>
                <p className="text-center text-sm text-gray-500">
                  Nhập email và mật khẩu của bạn
                </p>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <FiMail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-[42px] rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c29e6b] focus:border-transparent"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <FiLock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-[42px] rounded-md border border-gray-300 pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#c29e6b] focus:border-transparent"
                      placeholder="Mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 text-[#c29e6b] focus:ring-[#c29e6b] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Nhớ mật khẩu
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-[#c29e6b] hover:underline">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 mb-4">
                  <SocialButton
                    icon={<FcGoogle size={22} />}
                    label="Đăng nhập với Google"
                    onClick={handleGoogleLogin}
                    bgColor="bg-white border border-gray-300"
                    textColor="text-gray-700"
                  />

                  {/* Nếu muốn Facebook */}
                  <SocialButton
                    icon={<FaFacebookF size={20} />}
                    label="Đăng nhập với Facebook"
                    // onClick={handleFacebookLogin}
                    bgColor="bg-[#4267B2]"
                    textColor="text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#c29e6b] rounded-md h-[42px] font-medium text-white hover:bg-[#b58a5c] transition duration-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
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
                      ĐANG XỬ LÝ...
                    </>
                  ) : (
                    "ĐĂNG NHẬP"
                  )}
                </button>
                {error && (
                  <div className="mt-3 text-center text-sm text-red-600">
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Khách hàng mới?{" "}
                  <Link
                    className="text-[#c29e6b] hover:underline font-medium"
                    to="/register"
                    onClick={() => setIsOpen(false)}
                  >
                    Tạo tài khoản
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AuthDropdowns;
