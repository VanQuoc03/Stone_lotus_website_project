import { useEffect, useState } from "react";
import { fetchProducts } from "@/api/productApi";

export default function useFilteredProducts(categoryId = null) {
  const [products, setProducts] = useState([]);
  const [priceFilters, setPriceFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const param = {
        page,
        limit,
        ...(categoryId && categoryId !== "all" && { category: categoryId }),
        ...(priceFilters.length > 0 && {
          priceRanges: priceFilters.map((p) => `${p.min}-${p.max}`),
        }),
      };
      const res = await fetchProducts(param);
      const fetched = res.data.products || [];

      setProducts((prev) => (page === 1 ? fetched : [...prev, ...fetched]));
      setTotalCount(res.data.total || fetched.length);
      setHasMore(page < (res.data.totalPage || 1));
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPage(1);
    // setProducts([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryId, JSON.stringify(priceFilters)]);
  useEffect(() => {
    fetchData();
  }, [page, categoryId, JSON.stringify(priceFilters)]);
  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePriceFilter = ({ prices }) => {
    setPriceFilters(prices);
  };
  return {
    products,
    totalCount,
    hasMore,
    loading,
    loadMore,
    handlePriceFilter,
  };
}
