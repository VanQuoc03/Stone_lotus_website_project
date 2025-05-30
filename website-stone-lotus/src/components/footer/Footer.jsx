"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGoogle,
  FaYoutube,
} from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký nhận tin
    console.log("Email đăng ký:", email);
    setEmail("");
    alert("Đăng ký nhận tin thành công!");
  };

  return (
    <footer>
      {/* Top section - Newsletter & Social - Lighter background */}
      <div className="bg-[#e8f4ee] text-gray-700 p-4">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          {/* Newsletter */}
          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            <h3 className="text-lg font-medium mr-4 mb-2 md:mb-0">
              Đăng ký nhận tin
            </h3>
            <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="px-4 py-2 rounded-l-md w-full md:w-64 border-0 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-[#c29e6b] hover:bg-[#b58a5c] text-white px-6 py-2 rounded-r-md transition duration-300"
              >
                ĐĂNG KÝ
              </button>
            </form>
          </div>

          {/* Social Media */}
          <div className="flex items-center md:items-end">
            <h3 className="text-2xl font-bold mr-4">Kết nối với chúng tôi</h3>
            <div className="flex space-x-2">
              <a
                href="#"
                className="bg-white p-2 rounded-full hover:bg-gray-200 transition duration-300"
              >
                <FaFacebookF className="text-gray-700 w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-white p-2 rounded-full hover:bg-gray-200 transition duration-300"
              >
                <FaTwitter className="text-gray-700 w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-white p-2 rounded-full hover:bg-gray-200 transition duration-300"
              >
                <FaInstagram className="text-gray-700 w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-white p-2 rounded-full hover:bg-gray-200 transition duration-300"
              >
                <FaGoogle className="text-gray-700 w-4 h-4" />
              </a>
              <a
                href="#"
                className="bg-white p-2 rounded-full hover:bg-gray-200 transition duration-300"
              >
                <FaYoutube className="text-gray-700 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Darker background */}
      <div className="bg-[#c5e0d1] text-gray-700">
        <div className="container mx-auto px-4 py-8 pl-7">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 - About */}
            <div>
              <h2 className="text-xl font-bold mb-4">VƯỜN SEN ĐÁ</h2>
              <p className="mb-4 text-sm leading-relaxed">
                Sen đá garden cung cấp sen đá sỉ và lẻ tại khu vực TPHCM. Với
                kinh nghiệm hoạt động hơn 7 năm tại TPHCM, vườn có đầy đủ kinh
                nghiệm để chọn lựa các loại sen đá phù hợp nhất có thể sống được
                tại nơi có khí hậu nóng như Sài Gòn. Ngoài sen đá vườn còn cung
                cấp chậu đất nung, chậu sứ, đất trồng sen đá và phụ kiện tiểu
                cảnh.
              </p>
              <div className="flex items-start mb-2">
                <MdLocationOn className="mr-2 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  180 đường Cao Lỗ, Phường 4, Quận 8, TPHCM
                </p>
              </div>
              <div className="flex items-center mb-2">
                <MdPhone className="mr-2 flex-shrink-0" />
                <p className="text-sm">0859 738 676</p>
              </div>
              <div className="flex items-center mb-4">
                <MdEmail className="mr-2 flex-shrink-0" />
                <p className="text-sm">sendagarden03@gmail.com</p>
              </div>
            </div>

            {/* Column 2 - Customer Support */}
            <div>
              <h2 className="text-xl font-bold mb-4">Hỗ trợ khách hàng</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Tìm kiếm
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Giới thiệu
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - Links */}
            <div>
              <h2 className="text-xl font-bold mb-4">Liên kết</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Trang chủ
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Sản phẩm
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Hướng dẫn mua hàng
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Chăm sóc
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Policies */}
            <div>
              <h2 className="text-xl font-bold mb-4">Chính sách</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Tìm kiếm
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <a href="#" className="text-sm hover:underline">
                    Giới thiệu
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="bg-[#b5d0c1] py-3 text-center text-sm">
          <div className="container mx-auto">
            <p>Copyright © {new Date().getFullYear()} Sen Đá Garden.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
