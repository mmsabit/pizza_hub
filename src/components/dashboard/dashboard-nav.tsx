"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Gift,
  LayoutDashboard,
  MapPin,
  ReceiptText,
  Settings,
  Store,
  User,
  Users,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Role } from "@/lib/roles";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  user: [
    { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/user/profile", icon: User },
    { label: "Orders", href: "/user/dashboard/order", icon: ReceiptText },
    { label: "Addresses", href: "#", icon: MapPin },
    { label: "Rewards", href: "#", icon: Gift },
    { label: "Settings", href: "#", icon: Settings },
  ],
  vendor: [
    { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { label: "Menu", href: "/vendor/dashboard/menu", icon: UtensilsCrossed },
    { label: "Orders", href: "/vendor/dashboard/order", icon: ReceiptText },
    { label: "Plan", href: "/vendor/dashboard/plan", icon: Wallet },
    { label: "Store profile", href: "/vendor/profile", icon: Store },
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/admin/dashboard/profile", icon: User },
    { label: "Vendors", href: "#", icon: Store },
    { label: "Users", href: "#", icon: Users },
    { label: "Orders", href: "/admin/dashboard/order", icon: ReceiptText },
    { label: "Menu", href: "/admin/dashboard/menu", icon: UtensilsCrossed },
    { label: "Reports", href: "#", icon: BarChart3 },
  ],
};

const SECTION_LABEL: Record<Role, string> = {
  user: "Overview",
  vendor: "Store",
  admin: "Admin",
};

/**
 * Exact matches only, so a parent route never lights up for its children.
 * Hash links only scroll, so they never claim the active state.
 */
function isActive(pathname: string, href: string) {
  return !href.includes("#") && href === pathname;
}

export function DashboardSidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-space-xs overflow-y-auto">
      <span className="mb-space-xs px-space-sm font-label-sm text-label-sm uppercase tracking-widest text-surface-container-high/40">
        {SECTION_LABEL[role]}
      </span>
      {NAV_BY_ROLE[role].map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.label}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex items-center gap-space-sm rounded-xl bg-primary-container px-space-sm py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25"
                : "flex items-center gap-space-sm rounded-xl px-space-sm py-space-sm font-label-lg text-label-lg text-surface-container-high/70 transition-colors hover:bg-surface-container-lowest/10 hover:text-surface-container-lowest"
            }
            href={item.href}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardMobileNav({ role }: { role: Role }) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-surface-container-high bg-surface-container-lowest lg:hidden">
      <div className="flex gap-space-xs overflow-x-auto px-margin py-space-sm">
        {NAV_BY_ROLE[role].map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.label}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full bg-primary-container px-space-sm py-space-xs font-label-md text-label-md text-on-primary-container"
                  : "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              }
              href={item.href}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
