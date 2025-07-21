import { useParams, useNavigate } from "react-router-dom";
import useFilteredProducts from "../hooks/useFilteredProducts";
import ProductPageLayout from "../components/product/ProductPageLayout";
import { toast } from "react-toastify";
import api from "@/utils/axiosInstance";

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
    handleSortChange, // Thêm handleSortChange vào đây
  } = useFilteredProducts(categoryId);

  const isAllProductPage = !categoryId;
  const categoryName = products?.[0]?.category?.name || "Danh mục";

  const handleAddToCart = async (product) => {
    const token = JSON.parse(localStorage.getItem("token")) || [];
    if (!token) {
      toast.warn("Bạn cần đăng nhập để thêm vào giỏ hàng");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  return (
    <ProductPageLayout
      title={isAllProductPage ? "Tất cả sản phẩm" : categoryName}
      products={products}
      totalCount={totalCount}
      onFilter={handlePriceFilter}
      onSortChange={handleSortChange} // Truyền handleSortChange xuống ProductPageLayout
      showLoadMore={hasMore}
      onLoadMore={loadMore}
      loading={loading}
      onAddToCart={handleAddToCart}
    />
  );
}
