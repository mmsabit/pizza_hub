import { Pizza } from "lucide-react";
import Link from "next/link";
import SiteHeaderBtn from "./site-headerBtn";
import { SiteHeaderSearch } from "./site-header-search";

const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Menu", href: "/menu", active: false },

];

export function SiteHeader() {  
  return (
    <header className="sticky  top-0 z-50 bg-dough-surface/95 backdrop-blur-md shadow-[0_4px_20px_rgba(253,157,62,0.08)]">
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-sm md:gap-space-md">
        <div className="flex items-center gap-space-lg">
          <Link
            aria-label="PizzaHub home"
            className="flex items-center gap-space-xs sm:gap-space-sm"
            data-path="home"
            href="/"
          >
            <Pizza
              className="h-8 w-8 shrink-0 text-primary-container sm:h-9 sm:w-9"
              size={36}
              strokeWidth={1.75}
            />
            <span className="font-headline-md text-xl font-bold text-charcoal-dark sm:text-headline-md">
              PizzaHub
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-space-md">
          <SiteHeaderSearch />
        </div>

        <nav className="hidden lg:flex items-center gap-space-lg overflow-x-auto py-space-xs">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              aria-current={link.active ? "page" : undefined}
              className={
                link.active
                  ? "whitespace-nowrap transition-colors py-space-xs text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary text-label-lg font-label-lg whitespace-nowrap transition-colors py-space-xs"
              }
              data-path="home"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm sm:gap-space-md">
          <SiteHeaderBtn/>
        </div>
      </div>
    </header>
  );
}
