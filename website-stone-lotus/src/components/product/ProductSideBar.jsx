import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const priceRanges = [
  { label: "Dưới 25.000₫", min: 0, max: 25000 },
  { label: "25.000₫ - 100.000₫", min: 25000, max: 100000 },
  { label: "100.000₫ - 300.000₫", min: 100000, max: 300000 },
  { label: "Trên 300.000₫", min: 300000, max: Infinity },
];
export default function ProductSideBar({ price }) {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const handleCheckBoxChange = (price) => {
    const isChecked = selectedPrices.includes(price);
    const updatedPrice = isChecked
      ? selectedPrices.filter((price) => price !== price)
      : [...selectedPrices, price];
    setSelectedPrices(updatedPrice);
    onFilter({ prices: updatedPrice });
  };
  return (
    <div className="bg-white p-4 shadow-md rounded-lg min-w-[320px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left p-2 transition duration-200"
      >
        <span className="font-bold mb-2">Lọc giá</span>
        <span>{isOpen ? "▴" : "▾"}</span>
      </button>

      <hr />
      {isOpen && (
        <ul>
          {priceRanges.map((price, index) => (
            <li key={index}>
              <label htmlFor="" className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(price)}
                  onChange={() => handleCheckBoxChange(price)}
                  className="m-2 size-4"
                />
                <span>{price.label}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
