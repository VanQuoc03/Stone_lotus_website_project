// components/CartItem.jsx
import React from "react";

export default function CartItem({ product, quantity, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b py-3">
      <div className="flex items-center gap-4">
        <img
          src={product.images?.[0]?.image_url || "/placeholder.svg"}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <p className="font-semibold">{product.name}</p>
          <p>{product.price.toLocaleString()}₫</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onUpdateQuantity(product._id, quantity - 1)}
              className="border px-2"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product._id, quantity + 1)}
              className="border px-2"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(product._id)}
        className="text-red-500"
      >
        Xóa
      </button>
    </div>
  );
}
