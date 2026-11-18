import { Bell, Pizza, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PROFILE_SRC = "/images/avatar.jpg";

export function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-surface-container-high bg-surface-container-lowest/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-space-md px-margin">
        <Link
          aria-label="PizzaHub home"
          className="flex items-center gap-space-xs lg:hidden"
          href="/"
        >
          <Pizza className="text-primary-container" size={26} strokeWidth={1.75} />
          <span className="font-headline-sm text-headline-sm font-bold text-charcoal-dark">
            PizzaHub
          </span>
        </Link>

        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search
            className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
            size={18}
          />
          <input
            className="w-full rounded-full bg-surface-container-low py-space-sm pl-10 pr-space-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container"
            placeholder="Search orders, crusts, riders..."
            type="text"
          />
        </div>

        <div className="ml-auto flex items-center gap-space-sm md:ml-0">
          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-surface-container-high text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            type="button"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary-container" />
          </button>         
        </div>
      </div>
    </header>
  );
}
