import React, { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import LocationDropdown from "./LocationDropdown";
import AuthDropdowns from "./AuthDropdowns";
import Cart from "./Cart";
import SearchBar from "./SearchBar";
import MainNavItems from "./MainNavItems";
import { fetchCategories } from "@/api/categoryApi";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

function Header() {
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục", error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={`bg-white shadow fixed top-0 w-full z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-[#93b8a4] h-[35px] flex justify-center items-center">
        <p className="text-white text-sm">
          Hoàn tiền <strong>100%</strong> nếu sản phẩm hư hỏng do vận chuyển
        </p>
      </div>

      <div className="bg-[#347764] px-4 lg:px-6 py-4">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white text-2xl"
            >
              {isMobileMenuOpen ? <IoClose /> : <HiMenu />}
            </button>
            <h1 className="text-xl font-bold text-white">SEN ĐÁ...</h1>
          </div>
          <div className="flex items-center gap-3">
            <LocationDropdown />
            <AuthDropdowns />
            <Cart />
          </div>
        </div>
        <div className="lg:hidden mt-4">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={handleSearch}
            inputClass="bg-white"
          />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="text-white font-bold text-2xl">SEN ĐÁ GARDEN</div>
          <div className="w-full max-w-xl mx-8">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSubmit={handleSearch}
            />
            <div className="flex mt-2 space-x-4 text-white text-sm">
              <div className="flex items-center">
                <img
                  src="https://theme.hstatic.net/1000187613/1001083990/14/header_03_policy_1_ico.png?v=218"
                  className="w-4 h-4 mr-2"
                />
                <p>Sản phẩm giống ảnh trên 90%</p>
              </div>
              <div className="flex items-center">
                <img
                  src="https://theme.hstatic.net/1000187613/1001083990/14/header_03_policy_2_ico.png?v=218"
                  className="w-4 h-4 mr-2"
                />
                <p>Giao hàng toàn quốc</p>
              </div>
              <div className="flex items-center">
                <img
                  src="https://theme.hstatic.net/1000187613/1001083990/14/header_03_policy_3_ico.png?v=218"
                  className="w-4 h-4 mr-2"
                />
                <p>Mở hộp kiểm tra nhận hàng</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LocationDropdown />
            <AuthDropdowns />
            <Cart />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 bg-[#93b3a7] shadow">
          <MainNavItems categories={categories} />
          <hr className="my-4" />
          <div className="text-sm">
            <p className="font-bold">BẠN CẦN HỖ TRỢ?</p>
            <p className="mt-2">📞 0859738676</p>
            <p className="mt-1">✉️ sendagarden03@gmail.com</p>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-between bg-[#93b3a7] py-3 px-6 ">
        <nav className="container mx-auto">
          <MainNavItems categories={categories} />
        </nav>
      </div>
    </header>
  );
}

export default Header;
