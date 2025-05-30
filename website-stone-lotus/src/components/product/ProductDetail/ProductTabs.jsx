import React, { useState } from "react";
import ProductReviews from "./ProductReviews";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");
  return (
    <div className="border-t pt-6">
      <div className="flex gap-6 border-b mb-4">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 font-medium border-b-2 transition ${
            activeTab === "description"
              ? "border-[#c29e6b] text-[#c29e6b]"
              : "border-transparent text-gray-600 hover:text-black"
          }`}
        >
          Mô tả sản phẩm
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 font-medium border-b-2 transition ${
            activeTab === "reviews"
              ? "border-[#c29e6b] text-[#c29e6b]"
              : "border-transparent text-gray-600 hover:text-black"
          }`}
        >
          Nhận xét
        </button>
      </div>

      {/* Tabs content */}
      {activeTab === "description" && (
        <div className="text-sm text-gray-700 leading-relaxed">
          {product.description || "Không có mô tả nào cho sản phẩm này"}
        </div>
      )}
      {activeTab === "reviews" && <ProductReviews product={product} />}
    </div>
  );
}
