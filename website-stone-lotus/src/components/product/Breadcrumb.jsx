import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Breadcrumb() {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:3001/products";
        if (id) {
          url += `?categoryId=${id}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setCategoryName(data);
        if (id && data.length > 0) {
          setCategoryName(data[0].category?.name || "Danh mục");
        } else {
          setCategoryName("Tất cả sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };

    fetchData();
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
