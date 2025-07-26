import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import Header from "@/components/admin/Header";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import InventorySummary from "@/components/dashboard/InventorySummary";
import CategoryOverview from "@/components/dashboard/CategoryOverview";
import RecentOrders from "@/components/dashboard/RecentOrders";
import RecentAndLowStockTabs from "@/components/dashboard/RecentAndLowStockTabs";

const timeRanges = [
  { label: "24 giờ qua", value: "24h" },
  { label: "7 ngày qua", value: "7d" },
  { label: "30 ngày qua", value: "30d" },
  { label: "90 ngày qua", value: "90d" },
];

export default function Dashboard() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);
  const [range, setRange] = useState("7d");
  const dropdownRef = useRef();

  // useEffect(() => {
  //   setOpen(false);
  // }, [location.pathname]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel =
    timeRanges.find((r) => r.value === range)?.label || "7 ngày qua";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>

        <div className="relative">
          <button
            className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm"
            onClick={() => setOpen(!open)}
          >
            <Calendar className="h-4 w-4" />
            <span>{selectedLabel}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-md shadow bg-white z-10 border text-sm">
              <div className="px-3 py-2 font-semibold text-gray-600">
                Khoảng thời gian
              </div>
              {timeRanges.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setRange(t.value);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <SummaryCards range={range} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Doanh số bán hàng</h2>
          <p className="text-sm text-gray-500 mb-4">
            Doanh số bán hàng theo thời gian
          </p>
          <SalesChart range={range} />
        </div>
        <TopProductsChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <InventorySummary />
        </div>
        <CategoryOverview />
      </div>
      <div>
        <RecentAndLowStockTabs />
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InventoryOverview />
        <ProductCategories />
      </div>
      <OrdersTabs /> */}
    </div>
  );
}
