"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GlobeIcon, SmartphoneIcon } from "lucide-react";

import SocialShareBox from "@/components/common/shared/social-share-box";
import Breadcrumb from "@/components/ui/breadcrumb";
import { ROUTES } from "@/configs/routes";
import { useProductQuery } from "@/hooks/api/product/useGetProduct";
import ProductDetailsTab from "@/modules/products/productDetails/product-tab";
import ProductDetails from "./ProductDetails";
import { IProduct } from "@/types";

type Props = {
  productSlug: string;
};

const SingleProductPage = ({ productSlug }: Props) => {

  const { data, isLoading } = useProductQuery(productSlug);

  const [productState, setProductState] = useState<IProduct | null>(null);

  const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.PRODUCT}/${productSlug}`;

  useEffect(() => {
    if (data) {
      setProductState(data as IProduct);
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!productState) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        Product not found.
      </div>
    );
  }

  const { shop } = productState;

  return (
    <div className="py-5">
      {/* Breadcrumb Section */}
      <section className="h-12 py-10 bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
        <Breadcrumb />
      </section>

      {/* Product Details and Sidebar */}
      <div className="flex flex-col space-y-5 xl:flex-row xl:space-x-6 container py-8">
        {/* Product Main Details */}
        <div className="w-full xl:w-[75%] overflow-hidden">
          <ProductDetails product={productState} />
        </div>

        {/* Sidebar with Shop Info */}
        <div className="w-full xl:w-[25%]">
          <div className="flex flex-col space-y-5 bg-gray-100 dark:bg-background py-4 sm:px-4 overflow-hidden">
            {/* Shop Card */}
            <div className="bg-white dark:bg-gray-800 py-4 px-4 w-full flex gap-4 items-center">
              <div className="max-w-[80px] w-full">
                {shop?.logo?.img_url ? (
                  <Image
                    src={shop.logo.img_url}
                    alt={shop?.name || "Shop logo"}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-[80px] h-[80px] rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
                    No Image
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-primary text-lg font-semibold">
                  {shop?.name || "Unnamed Shop"}
                </h1>
              </div>
            </div>

            {/* Shop Description */}
            <div className="flex flex-col space-y-3">
              {shop?.description && (
                <p className="text-sm text-gray-400">{shop.description}</p>
              )}
              <span className="w-full border-dotted border-t-2 mt-4" />

              {/* Contact Info */}
              {shop?.settings?.contact && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2">
                    <SmartphoneIcon className="w-4 text-primary" />
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      Contact:
                    </p>
                  </span>
                  <p>{shop.settings.contact}</p>
                </div>
              )}

              {/* Website Info */}
              {shop?.settings?.website && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="flex items-center gap-1 sm:gap-2">
                    <GlobeIcon className="w-4 text-primary" />
                    <p className="text-xs sm:text-base text-gray-900 dark:text-white font-medium">
                      Website:
                    </p>
                  </span>
                  <p className="text-xs sm:text-base">
                    {shop.settings.website}
                  </p>
                </div>
              )}
            </div>

            {/* Social Share Box */}
            <SocialShareBox
              className="transition-all duration-300"
              shareUrl={productUrl}
            />
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="container">
        <ProductDetailsTab product={productState} />
      </div>
    </div>
  );
};

export default SingleProductPage;
