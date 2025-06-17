import api from "@/utils/axiosInstance";
import React, { useState } from "react";

export default function StockEntryModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    quantity: "",
    purchasePrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.quantity ||
      !form.purchasePrice ||
      form.quantity <= 0 ||
      form.purchasePrice < 0
    ) {
      alert("Vui lòng nhập đúng số lượng và giá nhập");
      return;
    }
    try {
      await api.post("/api/purchases", {
        product: product._id,
        quantity: form.quantity,
        purchasePrice: form.purchasePrice,
      });
      alert("Nhập hàng thành công");
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo nhập hàng: ", error);
      alert("Đã xảy ra lỗi khi tạo nhập hàng");
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nhập hàng: {product.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Số lượng nhập"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            placeholder="Giá nhập mỗi đơn vị"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Nhập hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
