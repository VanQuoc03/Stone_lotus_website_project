// MainNavItems.jsx
import React, { useState } from "react";
import Dropdown from "../../assets/icon_header/Dropdown";
import { Link } from "react-router-dom";

function MainNavItems({ categories }) {
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleProductMenu = () => {
    setIsProductOpen(!isProductOpen);
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ul className="space-y-4 text-gray-800 text-base font-semibold lg:flex justify-center lg:space-y-0 lg:space-x-8 lg:text-white">
      <li>
        <Link to={"/"}>TRANG CHỦ</Link>
      </li>
      <li
        className="relative"
        onMouseEnter={() => setIsProductOpen(true)}
        onMouseLeave={() => setIsProductOpen(false)}
      >
        <Link
          to={"/products"}
          className="flex items-center gap-1"
          onClick={toggleProductMenu}
        >
          SẢN PHẨM
          <Dropdown />
        </Link>
        {/* Dropdown menu for mobile and desktop */}
        <ul
          className={`${
            isProductOpen ? "block" : "hidden"
          } lg:absolute lg:left-0 mt-2 lg:mt-0 lg:bg-white lg:text-gray-700 lg:shadow-md lg:rounded lg:min-w-[200px] lg:z-50`}
        >
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="px-4 py-2 hover:bg-gray-200 lg:px-4 lg:py-2"
            >
              <Link to={`/products/category/${cat._id}`}>{cat.name}</Link>
            </li>
          ))}
        </ul>
      </li>
      <li
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="flex items-center gap-1" onClick={toggleMenu}>
          HƯỚNG DẪN
          <Dropdown />
        </button>
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } lg:absolute lg:left-0 mt-2 lg:mt-0 lg:bg-white lg:text-gray-700 lg:shadow-md lg:rounded lg:min-w-[200px] lg:z-50`}
        >
          <li className="px-4 py-2 hover:bg-gray-200 lg:px-4 lg:py-2">
            <a href="#">Hướng dẫn đặt hàng</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-200 lg:px-4 lg:py-2">
            {" "}
            <a href="#">Hướng dẫn thanh toán</a>
          </li>
          <li className="px-4 py-2 hover:bg-gray-200 lg:px-4 lg:py-2">
            {" "}
            <a href="#">Giao hàng</a>{" "}
          </li>
          <li className="px-4 py-2 hover:bg-gray-200 lg:px-4 lg:py-2">
            {" "}
            <a href="#">Xem lại đơn hàng</a>{" "}
          </li>
        </ul>
      </li>
      <li>
        <Link to={"/care-guide"}>CHĂM SÓC</Link>
      </li>
      <li>
        <a href="#">LIÊN HỆ</a>
      </li>
    </ul>
  );
}

export default MainNavItems;
