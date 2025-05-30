import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);
  return (
    <div className=" bg-white p-4 shadow-md rounded-lg min-w-[320px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left transition duration-200"
      >
        <span className="font-bold mb-2">Danh mục sản phẩm</span>
        <span>{isOpen ? "▴" : "▾"}</span>
      </button>
      <hr />
      {isOpen && (
        <ul className="">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/products/category/${category.id}`}
                className="block hover:bg-gray-200 rounded py-1 pl-1"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
