import Breadcrumb from "./Breadcrumb";
import CategoryMenu from "./CategoryMenu";
import ProductSideBar from "./ProductSideBar";
import SortFilter from "./SortFilter";
import ProductGrid from "./ProductGrid";

export default function ProductPageLayout({
  title,
  products,
  totalCount,
  onFilter,
  onSortChange,
  showLoadMore = false,
  onLoadMore = null,
  loading,
  onAddToCart,
}) {
  return (
    <div className="flex gap-6 p-6 ml-[75px] mt-[200px]">
      <aside className="sticky top-5 h-max flex flex-col gap-4 min-w-[320px]">
        <Breadcrumb />
        <CategoryMenu />
        <ProductSideBar
          onFilter={({ prices }) => {
            onFilter({ prices });
          }}
        />
      </aside>
      <main className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <span className="text-gray-500 text-sm">Đang tải sản phẩm...</span>
          </div>
        )}
        <div className={loading ? "opacity-40 pointer-events-none" : ""}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-4 mr-10">{title}</h1>
            <span className="text-gray-600 text-sm mb-3">
              <strong className="font-bold">{totalCount}</strong> sản phẩm
            </span>
            <SortFilter onSortChange={onSortChange} />
          </div>

          {products.length === 0 ? (
            <p>Không có sản phẩm nào trong danh mục này.</p>
          ) : (
            <>
              <ProductGrid products={products} onAddToCart={onAddToCart} />
              {showLoadMore && onLoadMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={onLoadMore}
                    className="group relative inline-flex items-center justify-center px-6 py-3 border border-amber-500 text-amber-500 font-semibold rounded-lg overflow-hidden transition duration-300 ease-in-out hover:bg-amber-500 hover:text-white"
                  >
                    <span className="z-10">Xem thêm sản phẩm</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
