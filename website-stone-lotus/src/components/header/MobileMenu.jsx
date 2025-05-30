import React from "react";
import { IoClose } from "react-icons/io5";

function MobileMenu({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-white p-4  mt-[90px]">
      <ul className="space-y-4 text-gray-800 text-base font-semibold">
        <li>TRANG CHỦ</li>
        <li>SẢN PHẨM</li>
        <li>HƯỚNG DẪN MUA HÀNG</li>
        <li>CHĂM SÓC</li>
        <li>LIÊN HỆ</li>
      </ul>
      <hr className="my-6 w-full" />
      <div className="text-sm">
        <p className="font-bold">BẠN CẦN HỖ TRỢ?</p>
        <p className="flex items-center gap-2 mt-2">📞 0968 374 473</p>
        <p className="flex items-center gap-2 mt-1">✉️ vuonsendavn@gmail.com</p>
      </div>
    </div>
  );
}

export default MobileMenu;
