"use client";
import { ROUTES } from "@/configs/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const headerLinks = [
  { href: ROUTES.PRODUCT, label: "Products" },
  // { href: ROUTES.SHOPS, label: "Offer" },
  { href: ROUTES.HELP, label: "Faq" },
  { href: ROUTES.CONTACT, label: "Contact" },
];

const StaticMenu = () => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex items-center justify-center space-x-10">
        {headerLinks.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <li key={href} className="relative group list-none">
              <Link
                href={href}
                className={`text-[15px] font-semibold uppercase tracking-[0.1em] transition-all duration-300
                  ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  }`}
              >
                {label}
              </Link>

              {/* Elegant underline animation */}
              <span
                className={`absolute left-0 -bottom-[3px] h-[1.5px] bg-black dark:bg-white transition-all duration-300 ease-in-out
                  ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default StaticMenu;
