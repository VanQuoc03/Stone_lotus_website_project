import React, { useState } from "react";

const priceRanges = [
  { label: "Dưới 25.000₫", min: 0, max: 25000 },
  { label: "25.000₫ - 100.000₫", min: 25000, max: 100000 },
  { label: "100.000₫ - 300.000₫", min: 100000, max: 300000 },
  { label: "Trên 300.000₫", min: 300000, max: Infinity },
];

export default function ProductSideBar({ onFilter }) {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const handleCheckBoxChange = (range) => {
    const alreadySelected = selectedPrices.some(
      (p) => p.min === range.min && p.max === range.max
    );

    const updatedPrices = alreadySelected
      ? selectedPrices.filter((p) => p.min !== range.min || p.max !== range.max)
      : [...selectedPrices, range];

    setSelectedPrices(updatedPrices);
    onFilter && onFilter({ prices: updatedPrices });
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
          {priceRanges.map((range, index) => (
            <li key={index}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPrices.some(
                    (p) => p.min === range.min && p.max === range.max
                  )}
                  onChange={() => handleCheckBoxChange(range)}
                  className="m-2 size-4"
                />
                <span>{range.label}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
