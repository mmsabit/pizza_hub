import {
  ArrowRight,
  BadgeCheck,
  Check,
  Crown,
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
import type { JSX } from "react";

import { UpgradeToPremium } from "@/components/dashboard/vendorplan/upgrade-to-premium";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { auth } from "@/lib/auth";
import { getMenuUsage } from "@/lib/menu-usage";
import { getPremiumState } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Plan & billing — PizzaHub",
  description:
    "Compare the Free and Premium PizzaHub vendor plans, check your menu usage and manage your subscription.",
};

export const dynamic = "force-dynamic";

const FREE_FEATURES = [
  "Unlimited menus",
  "Basic vendor dashboard",
  "Order management",
];

const PREMIUM_FEATURES = [
  "Premium vendor badge",
  "Featured menu placement",
  "All Free features included",
];

const COMPARISON: Array<{
  feature: string;
  free: string | boolean;
  premium: string | boolean;
}> = [
  { feature: "Menus", free: "Unlimited", premium: "Unlimited" },
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

export default async function PlanPage(): Promise<JSX.Element> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const user = session?.user;
  const vendorName = user?.name ?? "Your storefront";
  const jwtToken = await auth.api.getToken({ headers: requestHeaders });
  const { total: menuCount } = await getMenuUsage(
    user?.id ?? "",
    jwtToken.token,
  );

  const premium = await getPremiumState(user?.id ?? "");

  return (
    <div className="space-y-space-lg">
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Plan &amp; billing
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Your PizzaHub plan
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {premium
              ? `${vendorName} is on Premium — unlimited menu items and featured placement are live.`
              : `${vendorName} is on the Free plan — publish as many menu items as your kitchen needs.`}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-space-xs rounded-full px-space-sm py-space-xs font-label-md text-label-md font-bold ${
            premium
              ? "bg-crust-gold/20 text-secondary"
              : "bg-basil-fresh/15 text-tertiary"
          }`}
        >
          {premium ? <Crown size={14} /> : <BadgeCheck size={14} />}
          {premium
            ? "Premium plan · Active"
            : "Free plan · Active"}
        </span>
      </Reveal>

      <Reveal className="grid gap-space-md xl:grid-cols-3">
        <Stagger
          className="grid gap-space-md sm:grid-cols-2 xl:col-span-2"
          stagger={0.12}
        >
          <StaggerItem
            as="article"
            className="flex flex-col rounded-3xl border border-surface-container-high bg-surface-container-lowest p-space-lg shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-space-xs">
              <span className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                <Store size={12} />
                Free
              </span>
              <span
                className={`inline-flex items-center gap-space-xs rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${
                  premium
                    ? "bg-surface-container-low text-on-surface-variant"
                    : "bg-tertiary-fixed text-on-tertiary-fixed"
                }`}
              >
                {!premium ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                ) : null}
                {premium ? "Included in Premium" : "Current plan"}
              </span>
            </div>

            <div className="mt-space-md flex items-end gap-space-xs">
              <p className="font-headline-lg text-headline-lg text-charcoal-dark">
                $0
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

            <div
              className={`mt-space-lg rounded-xl border px-space-md py-space-sm text-center font-label-lg text-label-lg font-bold ${
                premium
                  ? "border-surface-container-high bg-surface-container-low text-on-surface-variant"
                  : "border-surface-container-high bg-surface-container-low text-outline"
              }`}
            >
              {premium
                ? "Included with your Premium plan"
                : "You are on this plan"}
            </div>
          </StaggerItem>

          <StaggerItem
            as="article"
            className="relative flex flex-col overflow-hidden rounded-3xl bg-charcoal-dark p-space-lg text-surface-container-lowest shadow-xl shadow-charcoal-dark/20"
          >
            <span className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-crust-gold/15 blur-2xl" />
            <span className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary-container/25 blur-2xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-space-xs">
              <span className="inline-flex items-center gap-space-xs rounded-full bg-crust-gold/20 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-crust-gold">
                <Crown size={12} />
                Premium
              </span>
              {premium ? (
                <span className="inline-flex items-center gap-space-xs rounded-full bg-basil-fresh/15 px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-tertiary-fixed">
                  <BadgeCheck size={12} />
                  Current plan
                </span>
              ) : (
                <span className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-lowest/10 px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-crust-gold">
                  <Sparkles size={12} />
                  Recommended
                </span>
              )}
            </div>

            <div className="relative mt-space-md flex items-end gap-space-xs">
              <p className="font-headline-lg text-headline-lg text-surface-container-lowest">
                $20
              </p>
              <p className="pb-1 font-label-lg text-label-lg text-surface-container-high/70">
                / per month
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
              {premium ? (
                <button
                  aria-disabled="true"
                  className="mt-space-lg inline-flex w-full cursor-not-allowed items-center justify-center gap-space-xs rounded-xl border border-surface-container-lowest/15 bg-surface-container-lowest/10 px-space-md py-space-sm font-label-lg text-label-lg font-bold text-surface-container-high/70"
                  disabled
                  type="button"
                >
                  <BadgeCheck size={16} />
                  You are now on the Premium plan
                </button>
              ) : (
                <UpgradeToPremium />
              )}
            </div>
          </StaggerItem>
        </Stagger>

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
                {menuCount}
              </span>
              <span className="font-label-lg text-label-lg text-outline">
                {menuCount === 1 ? "menu" : "menus"}
              </span>
            </p>

            <p className="mt-space-sm font-label-sm text-label-sm text-outline">
              Published menus across your storefront.
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
                <dd className="font-bold text-charcoal-dark">
                  {premium ? "Premium" : "Free"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-space-sm py-space-sm">
                <dt className="text-on-surface-variant">Monthly total</dt>
                <dd className="font-bold text-charcoal-dark">
                  {premium ? "$20" : "$0"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-space-sm py-space-sm">
                <dt className="text-on-surface-variant">
                  Next charge
                </dt>
                <dd className="font-bold text-charcoal-dark">
                  {premium ? "Monthly · $20" : "None"}
                </dd>
              </div>
            </dl>

            <p className="mt-space-sm flex items-start gap-space-xs rounded-xl bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-tertiary"
                size={14}
              />
              {premium
                ? "Premium is active and renews monthly through Stripe. Contact PizzaHub support if you need to change your plan."
                : "No card on file. Premium is $20/month, billed securely through Stripe."}
            </p>
          </section>
        </div>
      </Reveal>

      <Reveal
        as="section"
        className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm"
        delay={0.1}
      >
        <div className="flex flex-wrap items-end justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
          <div>
            <h2 className="font-title-md text-title-md text-charcoal-dark">
              Compare the plans
            </h2>
            <p className="font-label-sm text-label-sm text-outline">
              Everything the Free plan includes, and what Premium adds on top.
            </p>
          </div>
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
      </Reveal>

      <Reveal
        as="p"
        className="flex items-center justify-center gap-space-xs text-center font-label-sm text-label-sm text-outline"
        delay={0.15}
      >
        <Crown className="shrink-0 text-outline-variant" size={13} />
        {premium
          ? "Premium is active and renews monthly through Stripe's secure checkout."
          : "Premium is billed monthly through Stripe's secure checkout. Your Free plan stays active until the payment completes."}
      </Reveal>
    </div>
  );
}
