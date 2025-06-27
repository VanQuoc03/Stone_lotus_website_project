import api from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";

export default function FeaturedProducts() {
  const [products, setProduct] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get("/api/featured?type=product&limit=5");
        setProduct(res.data);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm nổi bật", err);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
