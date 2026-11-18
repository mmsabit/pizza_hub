import {
  Gift,
  LayoutDashboard,
  LogIn,
  MapPin,
  Pizza,
  ReceiptText,
  Settings,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DASHBOARD_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "Orders", href: "#recent-orders", icon: ReceiptText, active: false },
  { label: "Menu", href: "#", icon: UtensilsCrossed, active: false },
  { label: "Addresses", href: "#", icon: MapPin, active: false },
  { label: "Rewards", href: "#", icon: Gift, active: false },
  { label: "Settings", href: "#", icon: Settings, active: false },
];

const PROFILE_SRC = "/images/avatar.jpg";

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-charcoal-dark px-space-md py-space-lg lg:flex">
      <Link
        aria-label="PizzaHub home"
        className="mb-space-xl flex items-center gap-space-sm px-space-xs"
        href="/"
      >
        <Pizza className="text-secondary-container" size={30} strokeWidth={1.75} />
        <span className="font-headline-md text-headline-md font-bold text-surface-container-lowest">
          PizzaHub
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-space-xs overflow-y-auto">
        <span className="mb-space-xs px-space-sm font-label-sm text-label-sm uppercase tracking-widest text-surface-container-high/40">
          Overview
        </span>
        {DASHBOARD_NAV.map((item) => (
          <Link
            key={item.label}
            aria-current={item.active ? "page" : undefined}
            className={
              item.active
                ? "flex items-center gap-space-sm rounded-xl bg-primary-container px-space-sm py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25"
                : "flex items-center gap-space-sm rounded-xl px-space-sm py-space-sm font-label-lg text-label-lg text-surface-container-high/70 transition-colors hover:bg-surface-container-lowest/10 hover:text-surface-container-lowest"
            }
            href={item.href}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-space-lg rounded-2xl bg-surface-container-lowest/5 p-space-sm">
        <div className="flex items-center gap-space-sm">
          <Image
            alt="Elena Lorenzo"
            className="h-9 w-9 rounded-full object-cover"
            height={36}
            src={PROFILE_SRC}
            width={36}
          />
          <div className="min-w-0">
            <p className="truncate font-label-lg text-label-lg text-surface-container-lowest">
              Elena Lorenzo
            </p>
            <p className="truncate font-label-sm text-label-sm text-surface-container-high/60">
              VIP member
            </p>
          </div>
        </div>
        <div className="mt-space-sm flex flex-col gap-space-xs">
          <Link
            className="inline-flex items-center gap-space-xs rounded-lg px-space-xs py-space-xs font-label-sm text-label-sm text-surface-container-high/70 transition-colors hover:bg-surface-container-lowest/10 hover:text-surface-container-lowest"
            href="/"
          >
            <Store size={14} />
            Back to storefront
          </Link>
          <Link
            className="inline-flex items-center gap-space-xs rounded-lg px-space-xs py-space-xs font-label-sm text-label-sm text-surface-container-high/70 transition-colors hover:bg-surface-container-lowest/10 hover:text-surface-container-lowest"
            href="/sign-in"
          >
            <LogIn size={14} />
            Switch account
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function DashboardMobileNav() {
  return (
    <nav className="border-b border-surface-container-high bg-surface-container-lowest lg:hidden">
      <div className="flex gap-space-xs overflow-x-auto px-margin py-space-sm">
        {DASHBOARD_NAV.map((item) => (
          <Link
            key={item.label}
            aria-current={item.active ? "page" : undefined}
            className={
              item.active
                ? "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full bg-primary-container px-space-sm py-space-xs font-label-md text-label-md text-on-primary-container"
                : "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            }
            href={item.href}
          >
            <item.icon size={14} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
