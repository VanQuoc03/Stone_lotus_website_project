import React from "react";

export default function CartItem({
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
  availableStock,
}) {
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
          <p className="text-sm text-gray-600">
            {availableStock > 0 ? `Còn ${availableStock} trong kho` : ""}
          </p>
          <div className="flex gap-2 mt-2 items-center">
            <button
              onClick={() => onUpdateQuantity(product._id, quantity - 1)}
              disabled={quantity <= 1}
              className={`border px-2 py-1 rounded ${
                quantity <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product._id, quantity + 1)}
              disabled={quantity >= availableStock || availableStock === 0}
              className={`border px-2 py-1 rounded ${
                quantity >= availableStock || availableStock === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(product._id)}
        className="text-red-500 hover:text-red-700"
      >
        Xóa
      </button>
    </div>
  );
}
