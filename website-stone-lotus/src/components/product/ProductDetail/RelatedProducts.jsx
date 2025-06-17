import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../ProductCard";
import { fetchRelatedProducts } from "@/api/productApi";

export default function RelatedProducts({ categoryId, currentId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!categoryId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetchRelatedProducts(categoryId, currentId);
        setRelated(res.data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm liên quan", error);
        setError("Không thể tải sản phẩm liên quan.");
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [categoryId, currentId]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  // Nếu không có categoryId, không hiển thị gì cả
  if (!categoryId) return null;

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="w-full py-8">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="w-full py-4">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  // Không hiển thị gì nếu không có sản phẩm liên quan
  if (related.length === 0) {
    return (
      <div className="w-full py-4">
        <h2 className="text-2xl font-bold mb-4">
          Sản phẩm liên quan{" "}
          {/* {categoryName ? `trong danh mục "${categoryName}"` : ""} */}
        </h2>
        <p className="text-gray-500 text-center">
          Không có sản phẩm liên quan trong danh mục này.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
      <div ref={scrollRef} className="grid grid-cols-5 gap-4 mb-2">
        {related.map((product) => (
          <div key={product._id} className="min-w-[208px] max-w-[208px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
