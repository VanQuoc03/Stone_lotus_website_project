import { useParams } from "react-router-dom";
import { useState } from "react";
import useFilteredProducts from "../hooks/useFilteredProducts";
import ProductPageLayout from "../components/product/ProductPageLayout";

export default function ProductPage() {
  const { id: categoryId } = useParams();
  const { products, handlePriceFilter, totalCount } =
    useFilteredProducts(categoryId);
  const [visibleCount, setVisibleCount] = useState(30);

  const isAllProductPage = !categoryId;
  const visibleProducts = isAllProductPage
    ? products.slice(0, visibleCount)
    : products;

  const handleLoadMore = () => setVisibleCount((prev) => prev + 30);
  const categoryName = products[0]?.category?.name || "Danh mục";

  return (
    <ProductPageLayout
      title={isAllProductPage ? "Tất cả sản phẩm" : categoryName}
      products={visibleProducts}
      totalCount={totalCount}
      onFilter={handlePriceFilter}
      showLoadMore={isAllProductPage && visibleCount < products.length}
      onLoadMore={isAllProductPage ? handleLoadMore : undefined}
    />
  );
}
