import { useEffect, useState } from "react";

export default function useFilteredProducts(categoryId = null) {
  const [products, setProducts] = useState([]);
  const [priceFilters, setPriceFilters] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://localhost:3001/products";
        const query = [];

        if (categoryId) query.push(`category.id=${categoryId}`);
        if (priceFilters.length === 2) {
          query.push(`price_gte=${priceFilters[0]}`);
          query.push(`price_lte=${priceFilters[1]}`);
        }

        url += `?${query.join("&")}`;

        const res = await fetch(url);
        const data = await res.json();

        setProducts(data);
        setTotalCount(data.length); // giả sử bạn fetch toàn bộ (tạm thời), hoặc sửa phần này nếu dùng pagination
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };

    fetchData();
  }, [categoryId, priceFilters]);

  const handlePriceFilter = ({ prices }) => setPriceFilters(prices);

  return { products, handlePriceFilter, totalCount };
}
