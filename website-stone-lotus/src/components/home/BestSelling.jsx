import React, { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";
import api from "@/utils/axiosInstance";

export default function BestSelling() {
  const [bestSellingProducts, setbestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const res = await api.get("/api/best-selling");
        console.log("Best Selling Products:", res.data);
        setbestSellingProducts(res.data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm bán chạy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellingProducts();
  }, []);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Sản phẩm bán chạy</h2>
      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {bestSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
