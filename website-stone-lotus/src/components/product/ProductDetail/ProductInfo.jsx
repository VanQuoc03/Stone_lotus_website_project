import React from "react";

export default function ProductInfo({ product }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="">
        Còn lại:{" "}
        <strong className="font-bold text-[#488881]">
          {product.inventory?.quantity || 0}
        </strong>{" "}
        sản phẩm
      </p>
      <div>
        <p>
          Giá:{" "}
          <strong className="font-bold text-2xl text-red-500">
            {product.price.toLocaleString()}₫
          </strong>
        </p>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {product.description}
      </p>
    </div>
  );
}
