"use client";

import { Menu, Pizza, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SiteHeaderBtn from "./site-headerBtn";
import { SiteHeaderSearch } from "./site-header-search";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themeToggleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (themeToggleRef.current) {
      themeToggleRef.current.checked =
        document.documentElement.dataset.theme === "dark";
    }
  }, []);

  const handleThemeChange = (enabled: boolean) => {
    const theme = enabled ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.cookie = `pizzahub-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };

  const renderNavLinks = () =>
    NAV_LINKS.map((link) => {
      const active =
        link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

      return (
        <Link
          key={link.label}
          aria-current={active ? "page" : undefined}
          className={
            active
              ? "whitespace-nowrap border-b-2 border-primary py-space-xs font-bold text-primary transition-colors"
              : "whitespace-nowrap py-space-xs font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-primary"
          }
          href={link.href}
          onClick={() => setMobileMenuOpen(false)}
        >
          {link.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 bg-dough-surface/95 shadow-[0_4px_20px_rgba(253,157,62,0.08)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-space-sm px-margin sm:h-20 md:gap-space-md">
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

        <div className="mx-space-md hidden max-w-md flex-1 xl:flex">
          <SiteHeaderSearch />
        </div>

        <nav className="hidden items-center gap-space-lg overflow-x-auto py-space-xs xl:flex">
          {renderNavLinks()}
        </nav>

        <div className="ml-auto flex items-center gap-space-sm sm:gap-space-md">
          <label className="swap swap-rotate rounded-full p-2 text-charcoal-dark transition-colors hover:bg-surface-container-low focus-within:ring-2 focus-within:ring-primary-container">
            <input
              aria-label="Toggle dark mode"
              onChange={(event) => handleThemeChange(event.target.checked)}
              ref={themeToggleRef}
              type="checkbox"
            />

            {/* sun icon */}
            <svg
              className="swap-on h-5 w-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-off h-5 w-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
          <SiteHeaderBtn />
          <button
            aria-controls="site-mobile-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-dark transition-colors hover:bg-surface-container-low focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container xl:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {mobileMenuOpen ? (
        <div
          className="border-t border-surface-container-high bg-dough-surface px-margin pb-space-md pt-space-sm xl:hidden"
          id="site-mobile-navigation"
        >
          <div className="mb-space-sm">
            <SiteHeaderSearch />
          </div>
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-space-lg"
          >
            {renderNavLinks()}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
