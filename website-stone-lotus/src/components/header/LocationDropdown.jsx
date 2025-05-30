"use client";

import { useEffect, useRef, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import MapIcon from "../../assets/icon_header/Map";

function LocationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
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

  return (
    <div className="relative lg:bg-[#6f9b90] rounded" ref={ref}>
      <button
        className="flex items-center justify-center text-white rounded p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="mr-2">
            <MapIcon />
          </div>
          <div className="hidden lg:block text-left text-sm">
            <p className="text-xs">Giao hoặc đến lấy tại</p>
            <p className="font-medium">180 Cao Lỗ,Phường...</p>
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
          className="fixed lg:absolute inset-x-0 top-[100px] lg:top-full lg:left-0 mx-auto lg:mx-0 z-50 sm:w-full sm:h-screen max-w-[100%] 
        lg:max-w-[420px] lg:w-[420px] bg-white shadow-xl rounded p-4 text-sm"
        >
          <h2 className="font-semibold text-center mb-2">KHU VỰC MUA HÀNG</h2>
          <hr className="mb-4" />
          <div className="bg-[#ecf2f0] p-2 rounded mb-2 border border-[#d3e1dd]">
            Giao hoặc đến lấy tại: <br />
            <strong>180 Cao Lỗ, Phường 4, Quận 8, TP. Hồ Chí Minh</strong>
          </div>
          <p className="text-sm">
            Chọn cửa hàng gần bạn nhất để tối ưu chi phí giao hàng. Hoặc đến lấy
            hàng
          </p>
          <hr className="my-2 mt-2" />
          <div className="flex items-center">
            <div className="mr-2">
              <IoLocationSharp className="size-6" />
            </div>
            <div>
              <p className="font-bold">SEN ĐÁ GARDEN</p>
              <p>180 Cao Lỗ, Phường 4, Quận 8, TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationDropdown;
