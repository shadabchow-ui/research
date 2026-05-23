import LogoSquare from "components/logo-square";
import { ThemeToggle } from "components/ThemeToggle";
import { NAV_ITEMS } from "lib/constants";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#262626] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu />
          </Suspense>
        </div>
        <div className="flex w-full items-center gap-8">
          <Link href="/" prefetch={true} className="flex items-center">
            <LogoSquare />
          </Link>
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            {NAV_ITEMS.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className="text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/products/live-avatar"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
