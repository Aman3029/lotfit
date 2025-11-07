"use client";
import ProductCard from "@/components/cards/ProductCard";
import ProductFeedLoader from "@/components/skelaton/product-feed-loader";
import { useGetProductsQuery } from "@/hooks/api/product/useGetProducts";

const OurProductsSection = () => {
  const { data, isLoading } = useGetProductsQuery({
    limit: 12,
  });
  const prodcuts = data?.docs;

  return (
    <section className="py-5 md:py-10 container">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold font-sans">Our Products</h1>
      </div>

      <div className="py-4 border-t-2 mt-3" />

      {/* ✅ Responsive Grid — 2 on mobile, 3 on tablet, 4+ on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
        {isLoading && !prodcuts ? (
          <ProductFeedLoader limit={12} uniqueKey="search-product" />
        ) : (
          <>
            {prodcuts?.map((product) => (
              <div
                key={product.slug}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 h-[420px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default OurProductsSection;
