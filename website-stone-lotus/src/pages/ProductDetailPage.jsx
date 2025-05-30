import React, { useEffect, useState } from "react";
import ProductInfo from "../components/product/ProductDetail/ProductInfo";
import ProductImageGallery from "../components/product/ProductDetail/ProductImageGallery";
import { useParams } from "react-router-dom";
import ProductTabs from "../components/product/ProductDetail/ProductTabs";
import ProductVariants from "../components/product/ProductDetail/ProductVariants";
import ProductQuantitySelector from "../components/product/ProductDetail/ProductQuantitySelector";
import ProductActions from "../components/product/ProductDetail/ProductActions";
import ProductPolicy from "../components/product/ProductDetail/ProductPolicy";
import RelatedProducts from "../components/product/ProductDetail/RelatedProducts";
import RecentlyViewed from "../components/product/ProductDetail/RecentlyViewed";
import Breadcrumb from "../components/product/Breadcrumb";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/products/${id}`);
        const data = await res.json();
        console.log("Sản phẩm: ", data);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi tải sản phẩm: ", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-6">Đang tải sản phẩm...</p>;

  return (
    <>
      <div className="ml-28 mt-[220px]">
        {" "}
        <Breadcrumb />
      </div>

      <div className="max-w-screen-xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hình ảnh */}
        <div className="lg:col-span-6">
          <ProductImageGallery images={product?.images || []} />
        </div>
        {/* Thông tin */}
        <div className="lg:col-span-6 space-y-4">
          <ProductInfo product={product} />

          {/* {product.variants && product.variants.length > 0 && (
          <ProductVariants
            variants={product.variants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )} */}

          <ProductQuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
          />
          <ProductActions
            product={product}
            quantity={quantity}
            variant={selectedVariant}
          />
          <ProductPolicy />
        </div>
        {/* Tabs: Mô tả + Nhận xét */}
        <div className="lg:col-span-12 mt-10">
          <ProductTabs product={product} />
        </div>

        {/* Liên quan */}
        <div className="lg:col-span-12 mt-10">
          <RelatedProducts
            categoryId={product.category.id}
            currentId={product.id}
          />
        </div>

        {/* Đã xem */}
        {/* <div className="lg:col-span-12 mt-10">
        <RecentlyViewed />
      </div> */}
      </div>
    </>
  );
}
