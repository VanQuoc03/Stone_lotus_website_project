import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "@/components/product/ProductGrid";
import api from "@/utils/axiosInstance";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!query?.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const res = await api(`/api/products?search=${query}`);
        setResults(res.data.products || []);
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        setError("Đã xảy ra lỗi khi tìm kiếm sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 mt-[200px] min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Kết quả tìm kiếm cho:{" "}
        <span className="text-green-700 font-bold">"{query}"</span>
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Đang tìm kiếm sản phẩm...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-600">
          Không tìm thấy sản phẩm nào phù hợp.
        </p>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  );
}
