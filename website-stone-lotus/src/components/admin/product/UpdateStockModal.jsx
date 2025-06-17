import React, { useEffect, useState } from "react";

export default function UpdateStockModal({ product, onClose, onSave }) {
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    if (product) {
      setQuantity(product.inventory?.quantity || 0);
    }
  }, [product]);
  if (!product) return null;
  const handleSubmit = () => {
    onSave(product._id, quantity);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Cập nhật tồn kho</h2>
        <div className="mb-4">
          <label htmlFor="" className="block text-sm font-medium">
            Số lượng
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
