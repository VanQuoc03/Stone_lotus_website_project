import React from "react";
import { IoSearch } from "react-icons/io5";

function SearchBar({ value, onChange, onSubmit, className = "", inputClass = "" }) {
  return (
    <form onSubmit={onSubmit} className={`relative w-full ${className}`}>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg pl-4 pr-12 py-2 focus:outline-none ${inputClass}`}
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-gray-500 p-2 rounded-full"
      >
        <IoSearch className="size-5" />
      </button>
    </form>
  );
}

export default SearchBar;
