import React from "react";
import { Link } from "react-router-dom";
const categories = [
  {
    label: "Sen đá - Xương rồng",
    image:
      "https://theme.hstatic.net/1000187613/1001083990/14/categorybanner_1_img.jpg?v=223",
  },
  {
    label: "Chậu đất nung - Chậu sứ",
    image:
      "https://theme.hstatic.net/1000187613/1001083990/14/categorybanner_2_img.jpg?v=223",
  },
  {
    label: "Đất trồng - Phân bón",
    image:
      "https://theme.hstatic.net/1000187613/1001083990/14/categorybanner_3_img.jpg?v=223",
  },
  {
    label: "Phụ kiện tiểu cảnh",
    image:
      "https://theme.hstatic.net/1000187613/1001083990/14/categorybanner_4_img.jpg?v=223",
  },
];
export default function CategoryNav() {
  return (
    <section className="py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-full mx-auto">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-white rounded shadow text-center overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-[200px] object-cover"
            />
            <div className="py-3 px-2 font-bold text-sm md:text-base">
              {cat.label}
            </div>
            <Link
              to={"#"}
              className="inline-block p-2 text-gray-600 hover:underline"
            >
              Xem ngay
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
