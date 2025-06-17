import { useParams, useNavigate } from "react-router-dom";
import useFilteredProducts from "../hooks/useFilteredProducts";
import ProductPageLayout from "../components/product/ProductPageLayout";

export default function ProductPage() {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();

  const {
    products,
    totalCount,
    hasMore,
    loading,
    loadMore,
    handlePriceFilter,
  } = useFilteredProducts(categoryId);

  const isAllProductPage = !categoryId;
  const categoryName = products?.[0]?.category?.name || "Danh mục";

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <ProductPageLayout
      title={isAllProductPage ? "Tất cả sản phẩm" : categoryName}
      products={products}
      totalCount={totalCount}
      onFilter={handlePriceFilter}
      showLoadMore={hasMore}
      onLoadMore={loadMore}
      loading={loading}
      onAddToCart={handleAddToCart}
    />
  );
}
