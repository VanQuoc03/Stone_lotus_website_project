import React from "react";

export default function ProductQuantitySelector({
  quantity,
  setQuantity,
  availableStock,
}) {
  const handleIncrease = () => {
    if (quantity >= availableStock) {
      toast.warn(`Sản phẩm này chỉ còn ${availableStock} trong kho!`);
      return;
    }
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      toast.warn("Số lượng không thể nhỏ hơn 1!");
      return;
    }
    setQuantity(quantity - 1);
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      toast.warn("Số lượng không thể nhỏ hơn 1!");
      setQuantity(1);
    } else if (value > availableStock) {
      toast.warn(
        `Số lượng yêu cầu (${value}) vượt quá số lượng trong kho (${availableStock})!`
      );
      setQuantity(availableStock);
    } else {
      setQuantity(value);
    }
  };

  return (
    <div className="space-y-2">
      {availableStock <= 3 && availableStock > 0 && (
        <p className="text-sm text-yellow-600">Sắp hết hàng!</p>
      )}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Số lượng: </span>
        <div className="flex items-center border rounded overflow-hidden">
          <button
            className="w-8 h-8 text-xl bg-gray-100 hover:bg-gray-200"
            onClick={handleDecrease}
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            readOnly
            min={1}
            max={availableStock}
            className="w-10 text-center border-l border-r outline-none"
          />
          <button
            onClick={handleIncrease}
            disabled={quantity > availableStock || availableStock === 0}
            className={`w-8 h-8 text-xl bg-gray-100 ${
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
  );
}
