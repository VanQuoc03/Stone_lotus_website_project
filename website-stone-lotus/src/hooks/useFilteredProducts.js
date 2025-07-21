import { useEffect, useState } from "react";
import { fetchProducts } from "@/api/productApi";

export default function useFilteredProducts(categoryId = null) {
  const [products, setProducts] = useState([]);
  const [priceFilters, setPriceFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState(""); // Thêm state cho sortOrder
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
        ...(sortOrder && { sort: sortOrder }), // Thêm sortOrder vào param
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
    // setProducts([]); // Không cần đặt lại products về rỗng, fetchData sẽ xử lý page === 1
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryId, JSON.stringify(priceFilters), sortOrder]); // Thêm sortOrder vào dependencies
  useEffect(() => {
    fetchData();
  }, [page, categoryId, JSON.stringify(priceFilters), sortOrder]); // Thêm sortOrder vào dependencies
  const loadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePriceFilter = ({ prices }) => {
    setPriceFilters(prices);
    setPage(1); // Reset page khi lọc giá
  };

  const handleSortChange = (sortOption) => {
    // Thêm hàm xử lý sắp xếp
    setSortOrder(sortOption);
    setPage(1); // Reset page khi sắp xếp
  };

  return {
    products,
    totalCount,
    hasMore,
    loading,
    loadMore,
    handlePriceFilter,
    handleSortChange, // Trả về hàm xử lý sắp xếp
  };
}
