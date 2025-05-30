import { bestSellingProducts } from "@/data/bestSellingProducts";
import React from "react";
import ProductCard from "../product/ProductCard";

export default function BestSelling() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Sản phẩm bán chạy</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
        {bestSellingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
