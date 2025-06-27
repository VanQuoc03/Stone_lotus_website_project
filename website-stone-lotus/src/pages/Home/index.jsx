import React from "react";
// import PromoBanner from "./PromoBanner";
// import ProductSection from "./ProductSection";
// import BlogPreview from "./BlogPreview";
import Headers from "../../components/header/Header";
import PromoBanner from "@/components/home/PromoBanner";
import CategoryNav from "@/components/home/CategoryNav";
import BestSelling from "@/components/home/BestSelling";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <div className="space-y-6 pt-[200px]">
      <div className="px-4 lg:px-20 max-w-full mx-auto space-y-10">
        <PromoBanner />
        <CategoryNav />
        <BestSelling />
        <FeaturedProducts />
      {/* <PotList />
      <BlogPreview /> */}
      </div>
    </div>
  );
}
