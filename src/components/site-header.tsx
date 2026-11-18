import { ChevronDown, LogIn, Pizza, Search, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "Explore Menu", href: "#", active: false },
  { label: "Categories", href: "#", active: false },
  { label: "Combos", href: "#", active: false },
];

const PROFILE_SRC = "/images/avatar.jpg";

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
          <Link
            aria-label="Open dashboard"
            className="flex items-center gap-space-xs cursor-pointer"
            href="/dashboard"
          >
            <Image
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              height={32}
              src={PROFILE_SRC}
              width={32}
            />
            <ChevronDown
              className="text-on-surface-variant hidden sm:block"
              size={14}
            />
          </Link>
          <div className="flex items-center gap-space-xs">
            <Link
              aria-label="Sign in"
              className="inline-flex items-center gap-space-xs whitespace-nowrap rounded-full bg-primary-container px-space-xs py-space-xs font-label-md text-label-md text-on-primary-container shadow-[0_4px_16px_rgba(211,47,47,0.18)] transition-all hover:bg-primary sm:px-space-sm"
              href="/sign-in"
            >
              <LogIn size={14} />
              <span className="hidden xl:inline">Sign In</span>
            </Link>
            <Link
              aria-label="Sign up"
              className="inline-flex items-center gap-space-xs whitespace-nowrap rounded-full border border-outline-variant px-space-xs py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary sm:px-space-sm"
              href="/sign-up"
            >
              <UserPlus size={14} />
              <span className="hidden xl:inline">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
