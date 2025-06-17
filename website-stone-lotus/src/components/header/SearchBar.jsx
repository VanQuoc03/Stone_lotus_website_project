import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "@/utils/axiosInstance";

function SearchBar({
  value,
  onChange,
  onSubmit,
  className = "",
  inputClass = "",
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch gợi ý khi nhập
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await api.get(`/api/products/autocomplete?q=${value}`);
        setSuggestions(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý tìm kiếm:", error);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [value]);

  // Xử lý chọn 1 item trong dropdown
  const handleSelect = (product) => {
    setShowDropdown(false);
    setSuggestions([]);
    navigate(`/products/${product._id}`);
  };

  // Xử lý submit (ấn Enter)
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    onSubmit(e);
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={`relative w-full ${className}`}
      >
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={value}
          onChange={(e) => {
            onChange(e);
            setShowDropdown(true);
          }}
          className={`
            w-full rounded-lg border border-gray-300 
            pl-4 pr-12 py-2 
            focus:outline-none focus:ring-2 focus:ring-[#93b8a4] 
            transition duration-200
            ${inputClass}
          `}
        />
        <button
          type="submit"
          className="
            absolute right-2 top-1/2 -translate-y-1/2 
            bg-[#93b8a4] hover:bg-[#7aa28e] 
            transition p-2 rounded-full text-white
          "
        >
          <IoSearch className="w-5 h-5" />
        </button>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <ul
          className="
            absolute z-50 w-full mt-2 bg-white 
            border border-gray-200 shadow-lg rounded-lg 
            overflow-hidden max-h-72 overflow-y-auto
          "
        >
          {suggestions.map((item) => (
            <li
              key={item._id}
              onClick={() => handleSelect(item)}
              className="
                flex items-center px-4 py-2 
                hover:bg-[#f0f4f2] transition cursor-pointer
              "
            >
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="
                    w-8 h-8 mr-3 object-cover 
                    rounded-md border
                  "
                />
              )}
              <span className="text-gray-800 text-sm">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
