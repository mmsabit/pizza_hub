import { Pizza, Search } from "lucide-react";
import Link from "next/link";
import SiteHeaderBtn from "./site-headerBtn";

const NAV_LINKS = [
  { label: "Home", href: "/", active: true },
  { label: "Menu", href: "/menu", active: false },
  { label: "Categories", href: "#", active: false },
  { label: "Combos", href: "#", active: false },
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
            href="#"
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
          <div className="relative w-full">
            <Search
              className="absolute left-space-md top-1/2 -translate-y-1/2 text-outline pointer-events-none"
              size={18}
            />
            <input
              className="w-full pl-10 pr-space-md py-space-sm rounded-full bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-[0_2px_8px_rgba(253,157,62,0.06)]"
              placeholder="Search wood-fired pies, dips, drinks..."
              type="text"
            />
          </div>
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
          <Link
            className="flex items-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary-container px-space-sm py-space-xs rounded-full shadow-[0_4px_16px_rgba(211,47,47,0.18)] transition-all sm:px-space-md"
            data-path="cart-and-checkout"
            href="#"
          >
            <Pizza size={18} />
            <div className="flex items-center gap-space-xs text-label-lg font-label-lg">
              <span className="hidden sm:inline">$28.50</span>
              <span className="bg-surface-container-lowest text-primary rounded-full px-space-xs text-label-sm font-label-sm">
                2
              </span>
            </div>
          </Link>
          <SiteHeaderBtn/>
        </div>
      </div>
    </header>
  );
}
