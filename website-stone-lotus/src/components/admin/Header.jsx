import { useState } from "react";
import { Bell, Droplets, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Header({ open, setOpen }) {
  const [theme, setTheme] = useState("light");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex md:hidden items-center justify-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Mở menu</span>
      </button>

      <div className="flex items-center gap-4 w-full">
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Droplets className="h-6 w-6 text-green-600" />
          <span className="sr-only md:not-sr-only md:inline-block">
            Sen Đá Garden Admin
          </span>
        </a>

        <form className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm shadow-sm focus:border-green-500 focus:outline-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-full p-2 hover:bg-gray-100"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
        <span className="sr-only">Chuyển đổi chế độ sáng/tối</span>
      </button>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-100"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Thông báo</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 z-20 mt-2 w-64 rounded-md border bg-white shadow-lg">
            <div className="px-4 py-2 font-semibold text-sm">Thông báo</div>
            <div className="border-t">
              <div className="px-4 py-2 text-sm hover:bg-gray-50">
                Đơn hàng mới (#1234)
              </div>
              <div className="px-4 py-2 text-sm hover:bg-gray-50">
                Sản phẩm sắp hết hàng: Sen đá hồng phấn
              </div>
              <div className="px-4 py-2 text-sm hover:bg-gray-50">
                5 khách hàng mới đăng ký hôm nay
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="rounded-full border border-gray-300 bg-white p-1 hover:bg-gray-100"
        >
          <img
            src="/placeholder-user.jpg"
            alt="Admin"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="sr-only">Tài khoản</span>
        </button>
        {profileOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border bg-white shadow-md">
            <div className="px-4 py-2 text-sm font-semibold">
              Tài khoản của tôi
            </div>
            <div className="border-t">
              <div className="px-4 py-2 text-sm hover:bg-gray-50">Hồ sơ</div>
              <div className="px-4 py-2 text-sm hover:bg-gray-50">Cài đặt</div>
            </div>
            <div className="border-t">
              <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-2 text-red-600 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
