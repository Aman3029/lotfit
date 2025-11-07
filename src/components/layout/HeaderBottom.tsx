"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetCategoriesQuery } from "../../hooks/api/category/useGetCategoriesQuery";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Icons } from "../ui/icons";
import StaticMenu from "./manu/static-menu";

const HeaderBottom = () => {
  const pathname = usePathname();
  const isHomepage = pathname == "/";
  const { data: categories } = useGetCategoriesQuery({ limit: 15 });
  return (
    <div className={cn(!isHomepage ? "hidden" : "block")}>
      <div
        className={cn(

          "hidden container md:flex justify-between items-center mt-6"

        )}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            {/* <Button className="flex gap-2 items-center">
            <Icons.category className="w-5" />
            All Categories
          </Button> */}
            <div className="flex gap-2 items-center" />
          </HoverCardTrigger>
          <HoverCardContent className="dark:bg-black w-80 duration-200" align="start">
            <div className="">
              {categories?.docs.map((category) => (
                <Link
                  className="flex justify-between items-center py-2 px-4 hover:bg-gray-100 dark:hover:text-gray-800"
                  href={`/products?category=${category.slug}`}
                  key={category.slug}
                >
                  <div className="flex gap-2 items-center">
                    <span></span>
                    <span>{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="hidden lg:flex items-center justify-center w-full">
          <StaticMenu />
        </div>

        <div className="bg-rose-300 text-primary">
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
