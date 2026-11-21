import {
  ArrowRight,
  BadgeCheck,
  Check,
  Crown,
  Infinity as InfinityIcon,
  Minus,
  ShieldCheck,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { UpgradeToPremium } from "@/components/dashboard/vendorplan/upgrade-to-premium";
import { auth } from "@/lib/auth";
import { FREE_MENU_LIMIT } from "@/lib/menu";
import { getMenuUsage } from "@/lib/menu-usage";

export const metadata: Metadata = {
  title: "Plan & billing — PizzaHub",
  description:
    "Compare the Free and Premium PizzaHub vendor plans, check your menu usage and request an upgrade.",
};

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement",
  "All Free features included",
];

const COMPARISON: Array<{
  feature: string;
  free: string | boolean;
  premium: string | boolean;
}> = [
  { feature: "Active menu items", free: "Up to 3", premium: "Unlimited" },
  { feature: "Vendor dashboard", free: "Basic", premium: "Full access" },
  { feature: "Order management", free: true, premium: true },
  { feature: "Premium vendor badge", free: false, premium: true },
  { feature: "Featured menu placement", free: false, premium: true },
  { feature: "All Free features", free: false, premium: true },
];

function CompareCell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return (
      <span className="font-label-lg text-label-lg text-on-surface-variant">
        {value}
      </span>
    );
  }

  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary">
      <Check size={14} strokeWidth={3} />
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-low text-outline">
      <Minus size={14} />
    </span>
  );
}

export default async function PlanPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const vendorName = session?.user?.name ?? "Your storefront";
  const { active: activeItems } = await getMenuUsage(session?.user?.id ?? "");

  const limitReached = activeItems >= FREE_MENU_LIMIT;
  const usagePercent = Math.min(
    Math.round((activeItems / FREE_MENU_LIMIT) * 100),
    100,
  );

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Plan &amp; billing
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Your PizzaHub plan
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {vendorName} is on the Free plan — upgrade when your menu outgrows
            three live items.
          </p>
        </div>

        <span className="inline-flex items-center gap-space-xs rounded-full bg-basil-fresh/15 px-space-sm py-space-xs font-label-md text-label-md font-bold text-tertiary">
          <BadgeCheck size={14} />
          Free plan · Active
        </span>
      </header>

      <div className="grid gap-space-md xl:grid-cols-3">
        <section className="grid gap-space-md sm:grid-cols-2 xl:col-span-2">
          <article className="flex flex-col rounded-3xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-space-xs">
              <span className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                <Store size={12} />
                Free
              </span>
              <span className="inline-flex items-center gap-space-xs rounded-full bg-tertiary-fixed px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-on-tertiary-fixed">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                Current plan
              </span>
            </div>

            <div className="mt-space-md flex items-end gap-space-xs">
              <p className="font-headline-lg text-headline-lg text-charcoal-dark">
                ৳0
              </p>
              <p className="pb-1 font-label-lg text-label-lg text-outline">
                / forever
              </p>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything you need to get your kitchen online.
            </p>

            <ul className="mt-space-md flex-1 space-y-space-sm">
              {FREE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-space-sm font-body-md text-body-md text-on-surface-variant"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-space-lg rounded-xl border border-surface-container-high bg-surface-container-low px-space-md py-space-sm text-center font-label-lg text-label-lg font-bold text-outline">
              You are on this plan
            </div>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-3xl bg-charcoal-dark p-space-lg text-surface-container-lowest shadow-xl shadow-charcoal-dark/20">
            <span className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-crust-gold/15 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary-container/25 blur-2xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-space-xs">
              <span className="inline-flex items-center gap-space-xs rounded-full bg-crust-gold/20 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-crust-gold">
                <Crown size={12} />
                Premium
              </span>
              <span className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-lowest/10 px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-crust-gold">
                <Sparkles size={12} />
                Recommended
              </span>
            </div>

            <div className="relative mt-space-md flex items-end gap-space-xs">
              <p className="font-headline-lg text-headline-lg text-surface-container-lowest">
                Custom
              </p>
              <p className="pb-1 font-label-lg text-label-lg text-surface-container-high/70">
                / billed monthly
              </p>
            </div>
            <p className="relative font-body-md text-body-md text-surface-container-high/70">
              For kitchens ready to stand out and scale their menu.
            </p>

            <ul className="relative mt-space-md flex-1 space-y-space-sm">
              {PREMIUM_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-space-sm font-body-md text-body-md text-surface-container-high/90"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-crust-gold/20 text-crust-gold">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="relative">
              <UpgradeToPremium />
            </div>
          </article>
        </section>

        <div className="space-y-space-md">
          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Plan usage
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <UtensilsCrossed size={16} />
              </span>
            </div>

            <p className="mt-space-sm flex items-baseline gap-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-charcoal-dark">
                {activeItems}
              </span>
              <span className="font-label-lg text-label-lg text-outline">
                / {FREE_MENU_LIMIT} active menu items
              </span>
            </p>

            <div className="mt-space-xs h-2 w-full overflow-hidden rounded-full bg-surface-container-low">
              <div
                className={`h-full rounded-full transition-all ${
                  limitReached ? "bg-primary-container" : "bg-crust-gold"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <p className="mt-space-sm font-label-sm text-label-sm text-outline">
              {limitReached
                ? "You have reached the Free limit. Upgrade to Premium to publish more dishes."
                : `${
                    FREE_MENU_LIMIT - activeItems
                  } more item${FREE_MENU_LIMIT - activeItems === 1 ? "" : "s"} left before you hit the Free limit.`}
            </p>

            <Link
              className="mt-space-md inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
              href="/vendor/dashboard/menu"
            >
              Manage menu
              <ArrowRight size={14} />
            </Link>
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Billing
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crust-gold/20 text-charcoal-dark">
                <Wallet size={16} />
              </span>
            </div>

            <dl className="mt-space-sm divide-y divide-surface-container-high font-label-lg text-label-lg">
              <div className="flex items-center justify-between gap-space-sm py-space-sm">
                <dt className="text-on-surface-variant">Current plan</dt>
                <dd className="font-bold text-charcoal-dark">Free</dd>
              </div>
              <div className="flex items-center justify-between gap-space-sm py-space-sm">
                <dt className="text-on-surface-variant">Monthly total</dt>
                <dd className="font-bold text-charcoal-dark">৳0</dd>
              </div>
              <div className="flex items-center justify-between gap-space-sm py-space-sm">
                <dt className="text-on-surface-variant">Next charge</dt>
                <dd className="font-bold text-charcoal-dark">None</dd>
              </div>
            </dl>

            <p className="mt-space-sm flex items-start gap-space-xs rounded-xl bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <ShieldCheck className="mt-0.5 shrink-0 text-tertiary" size={14} />
              No card on file. Premium upgrades are confirmed by the PizzaHub
              team before any charge.
            </p>
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
          <div>
            <h2 className="font-title-md text-title-md text-charcoal-dark">
              Compare the plans
            </h2>
            <p className="font-label-sm text-label-sm text-outline">
              Everything the Free plan includes, and what Premium adds on top.
            </p>
          </div>
          <span className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <InfinityIcon size={12} />
            Premium never caps your menu
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-140 text-left">
            <thead>
              <tr className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                <th className="px-space-md py-space-sm font-bold">
                  What you get
                </th>
                <th className="w-36 px-space-md py-space-sm text-center font-bold">
                  Free
                </th>
                <th className="w-36 px-space-md py-space-sm text-center font-bold text-secondary">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {COMPARISON.map((row) => (
                <tr key={row.feature} className="hover:bg-surface-container-low">
                  <td className="px-space-md py-space-sm font-label-lg text-label-lg text-charcoal-dark">
                    {row.feature}
                  </td>
                  <td className="px-space-md py-space-sm text-center">
                    <CompareCell value={row.free} />
                  </td>
                  <td className="bg-crust-gold/5 px-space-md py-space-sm text-center">
                    <CompareCell value={row.premium} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="flex items-center justify-center gap-space-xs text-center font-label-sm text-label-sm text-outline">
        <Crown className="shrink-0 text-outline-variant" size={13} />
        Upgrade requests are reviewed by the PizzaHub team, and your Free plan
        stays active until Premium is confirmed.
      </p>
    </div>
  );
}
