import { Dessert, IndentDecrease } from "lucide-react";
import React from "react";

export default function ProductQuantitySelector({
  quantity,
  setQuantity,
  maxQuantity = 10,
}) {
  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increase = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Số lượng: </span>
      <div className="flex items-center border rounded overflow-hidden">
        <button
          className="w-8 h-8 text-xl bg-gray-100 hover:bg-gray-200"
          onClick={decrease}
        >
          -
        </button>
        <input
          type="text"
          value={quantity}
          readOnly
          className="w-10 text-center border-l border-r outline-none"
        />
        <button
          onClick={increase}
          className="w-8 h-8 text-xl bg-gray-100 hover:bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  );
}
