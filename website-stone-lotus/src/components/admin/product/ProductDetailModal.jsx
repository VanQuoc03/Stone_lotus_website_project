import React from "react";

export default function ProductDetailModal({ product, onClose }) {
  console.log(product, onClose);
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h2>
        <p>
          <strong>Tên: </strong>
          {product.name}
        </p>
        <p>
          <strong>Mô tả: </strong>
          {product.description || "Sản phẩm này chưa có mô tả"}
        </p>
        <p>
          <strong>Giá: </strong>
          {product.price?.toLocaleString("vi-VN")} đ
        </p>
        <p>
          <strong>Tồn kho: </strong>
          {product.inventory?.quantity ?? 0}
        </p>
        <p>
          <strong>Danh mục: </strong>
          {product.category?.name || "Chưa có danh mục"}
        </p>
        <div className="flex gap-2 mt-4 flex-wrap">
          {product.images?.map((url, index) => (
            <img
              key={index}
              src={typeof url === "string" ? url : url.image_url}
              alt="Ảnh"
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
