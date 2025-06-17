import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCategories } from "@/api/categoryApi";
export default function Breadcrumb() {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategories();
        setCategoryName(data);
        if (id && data.length > 0) {
          const found = data.find((cat) => cat._id === id);
          setCategoryName(found?.name);
        } else {
          setCategoryName("Tất cả sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };

    load();
  }, [id]);

  return (
    <div className="text-sm text-gray-600 mb-4">
      <nav>
        <Link to={"/"} className="hover:underline">
          Trang chủ
        </Link>
        <span>{" > "}</span>
        {id ? (
          <>
            <span>Danh mục</span>
            {categoryName && (
              <>
                <span>{" > "}</span>
                <span>{categoryName}</span>
              </>
            )}
          </>
        ) : (
          <span>Tất cả sản phẩm</span>
        )}
      </nav>
    </div>
  );
}
