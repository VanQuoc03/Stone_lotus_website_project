import { useEffect, useState } from "react";
import api from "@/utils/axiosInstance";

export default function CategoryOverview() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/api/dashboard/category/summary");
      setCategories(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h2 className="text-xl font-bold">Danh mục sản phẩm</h2>
      <p className="text-sm text-gray-500 mb-4">
        Phân bổ sản phẩm theo danh mục
      </p>

      <ul className="space-y-2">
        {categories.map((cat, idx) => (
          <li
            key={cat._id}
            className="flex justify-between items-center text-sm text-gray-700"
          >
            <div className="flex items-center gap-2">
              <span>{cat.name}</span>
            </div>
            <span className="font-medium">{cat.count} sản phẩm</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
