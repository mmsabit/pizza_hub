import { CalendarPlus, Crown, Store, Wallet } from "lucide-react";
import type { Metadata } from "next";

import {
  AccountTable,
  accountCreatedTime,
  type AdminAccount,
} from "@/components/dashboard/adminaccounts/account-table";

export const metadata: Metadata = {
  title: "Vendors — PizzaHub admin",
  description:
    "Every vendor storefront on PizzaHub, with its plan, verification state and join date.",
};

const DAY = 24 * 60 * 60 * 1000;

const joinedWithin = (account: AdminAccount, days: number) => {
  const created = accountCreatedTime(account);

  return created > 0 && Date.now() - created <= days * DAY;
};

export default async function VendorListPage() {
  let fetchedVendors: AdminAccount[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) fetchedVendors = data as AdminAccount[];
    }
  } catch {
    fetchedVendors = [];
  }

  const vendors = [...fetchedVendors].sort(
    (a, b) => accountCreatedTime(b) - accountCreatedTime(a),
  );

  const premiumCount = vendors.filter((vendor) => vendor.premium).length;
  const newCount = vendors.filter((vendor) => joinedWithin(vendor, 30)).length;

  const stats = [
    {
      label: "Vendors",
      value: String(vendors.length),
      hint: "Accounts with the vendor role",
      icon: Store,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "Premium",
      value: String(premiumCount),
      hint: "Billed monthly through Stripe",
      icon: Crown,
      chipClassName: "bg-crust-gold/20 text-secondary",
    },
    {
      label: "Free plan",
      value: String(vendors.length - premiumCount),
      hint: "Not upgraded yet",
      icon: Wallet,
      chipClassName: "bg-surface-container-low text-on-surface-variant",
    },
    {
      label: "New this month",
      value: String(newCount),
      hint: "Joined in the last 30 days",
      icon: CalendarPlus,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
  ];

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Storefront partners
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Vendors
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {vendors.length === 0
              ? "No vendor accounts have been created yet."
              : `Watching ${vendors.length} ${
                  vendors.length === 1 ? "vendor" : "vendors"
                } across the platform.`}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-space-sm sm:gap-space-md xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.chipClassName}`}
            >
              <stat.icon size={20} />
            </span>
            <p className="mt-space-sm truncate font-headline-md text-headline-md text-charcoal-dark">
              {stat.value}
            </p>
            <p className="font-label-lg text-label-lg text-on-surface-variant">
              {stat.label}
            </p>
            <p className="mt-1 truncate font-label-sm text-label-sm text-outline">
              {stat.hint}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
          <div>
            <h2 className="font-title-md text-title-md text-charcoal-dark">
              Vendor directory
            </h2>
            <p className="font-label-sm text-label-sm text-outline">
              Newest storefronts first.
            </p>
          </div>
          <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <Crown size={14} />
            {premiumCount} of {vendors.length} on Premium
          </span>
        </div>

        {vendors.length === 0 ? (
          <div className="flex flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-outline">
              <Store size={22} />
            </span>
            <p className="font-title-md text-title-md text-charcoal-dark">
              No vendors yet
            </p>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              Vendor accounts appear here once a kitchen signs up and starts
              publishing a menu.
            </p>
          </div>
        ) : (
          <AccountTable accounts={vendors} variant="vendor" />
        )}
      </section>
    </div>
  );
}
