import {
  ArrowRight,
  Banknote,
  Flame,
  Plus,
  ReceiptText,
  Store,
  Timer,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Vendor dashboard — PizzaHub",
  description:
    "Track kitchen tickets, daily takings and payouts for your PizzaHub storefront.",
};

const STATS = [
  {
    label: "Orders today",
    value: "32",
    hint: "+18% vs yesterday",
    icon: ReceiptText,
    chipClassName: "bg-primary-fixed text-primary",
  },
  {
    label: "Revenue today",
    value: "$1,284",
    hint: "Average ticket $40.12",
    icon: Banknote,
    chipClassName: "bg-tertiary-fixed text-tertiary",
  },
  {
    label: "Avg. prep time",
    value: "14 min",
    hint: "3 min faster than last week",
    icon: Timer,
    chipClassName: "bg-secondary-fixed text-secondary",
  },
  {
    label: "Live dishes",
    value: "18",
    hint: "15 marked available",
    icon: UtensilsCrossed,
    chipClassName: "bg-crust-gold/20 text-charcoal-dark",
  },
];

const KITCHEN_QUEUE = [
  {
    id: "#PH-4832",
    items: "2 × Margherita, 1 × Garlic Knots",
    placed: "19:42",
    status: "In the oven",
    total: "$42.50",
    statusClassName: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    id: "#PH-4831",
    items: "1 × Double Pepperoni Picante, 2 × Cola",
    placed: "19:38",
    status: "Preparing",
    total: "$27.00",
    statusClassName: "bg-secondary-fixed text-on-secondary-fixed-variant",
  },
  {
    id: "#PH-4830",
    items: "1 × Truffle Wild Mushroom, 1 × Caesar Salad",
    placed: "19:31",
    status: "Ready for pickup",
    total: "$36.75",
    statusClassName: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    id: "#PH-4829",
    items: "1 × Smoky BBQ Brisket, 1 × Rum with Soda",
    placed: "19:24",
    status: "Out for delivery",
    total: "$29.40",
    statusClassName: "bg-basil-fresh/15 text-basil-fresh",
  },
];

const TOP_SELLERS = [
  {
    name: "Margherita",
    image: "/images/menu-margherita.jpg",
    sold: "128 sold this week",
    price: "$14.50",
  },
  {
    name: "Double Pepperoni Picante",
    image: "/images/menu-seafood.jpg",
    sold: "96 sold this week",
    price: "$16.00",
  },
  {
    name: "Truffle Wild Mushroom",
    image: "/images/menu-caesar.jpg",
    sold: "74 sold this week",
    price: "$18.75",
  },
];

export default async function VendorDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
            Vendor studio · Tuesday, 17 November
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            {firstName ? `Good evening, ${firstName}` : "Good evening"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Margherita &amp; Co. is live on the storefront · Downtown Brooklyn.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            href="/vendor/dashboard/menu"
          >
            <UtensilsCrossed size={16} />
            Edit menu
          </Link>
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
            href="/"
          >
            <Plus size={16} />
            Open storefront
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-space-sm sm:gap-space-md xl:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm"
          >
            <div className="flex items-start justify-between gap-space-sm">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.chipClassName}`}
              >
                <stat.icon size={20} />
              </span>
              <TrendingUp className="text-tertiary" size={16} />
            </div>
            <p className="mt-space-sm font-headline-md text-headline-md text-charcoal-dark">
              {stat.value}
            </p>
            <p className="font-label-lg text-label-lg text-on-surface-variant">
              {stat.label}
            </p>
            <p className="mt-1 font-label-sm text-label-sm text-outline">
              {stat.hint}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-space-md xl:grid-cols-3">
        <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
            <div>
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Kitchen queue
              </h2>
              <p className="font-label-sm text-label-sm text-outline">
                4 tickets on the pass right now
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
              href="#"
            >
              Open KDS
              <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="divide-y divide-surface-container-high">
            {KITCHEN_QUEUE.map((ticket) => (
              <li
                key={ticket.id}
                className="flex flex-wrap items-center gap-space-sm px-space-md py-space-md transition-colors hover:bg-surface-container-low"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary">
                  <ReceiptText size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                    {ticket.id}
                  </p>
                  <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                    {ticket.items}
                  </p>
                </div>

                <div className="flex w-full items-center justify-between gap-space-sm pl-14 sm:w-auto sm:justify-end sm:gap-space-md sm:pl-0">
                  <span
                    className={`whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${ticket.statusClassName}`}
                  >
                    {ticket.status}
                  </span>

                  <div className="text-right">
                    <p className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                      {ticket.total}
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">
                      Placed {ticket.placed}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-space-md">
          <section className="rounded-2xl bg-charcoal-dark p-space-md text-surface-container-lowest shadow-lg">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-space-xs rounded-full bg-basil-fresh/15 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-basil-fresh">
                <span className="h-1.5 w-1.5 rounded-full bg-basil-fresh" />
                Next payout
              </span>
              <Wallet className="text-secondary-container" size={22} />
            </div>

            <p className="mt-space-sm font-headline-sm text-headline-sm">$842.50</p>
            <p className="font-label-sm text-label-sm text-surface-container-high/70">
              Lands Friday, 18:00 · Chase ·· 4482
            </p>

            <div className="mt-space-md">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-surface-container-high/70">
                <span>Weekly target</span>
                <span>$1,170 / $1,600</span>
              </div>
              <div className="mt-space-xs h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest/15">
                <div className="h-full w-[72%] rounded-full bg-secondary-container" />
              </div>
            </div>

            <div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-crust-gold">
              <Flame size={14} />
              18 orders waiting to settle
            </div>
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Top sellers
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crust-gold/20 text-charcoal-dark">
                <Store size={16} />
              </span>
            </div>

            <ul className="mt-space-sm space-y-space-sm">
              {TOP_SELLERS.map((dish) => (
                <li key={dish.name} className="flex items-center gap-space-sm">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-container-low">
                    <Image
                      alt={dish.name}
                      className="object-cover"
                      fill
                      sizes="40px"
                      src={dish.image}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                      {dish.name}
                    </p>
                    <p className="truncate font-label-sm text-label-sm text-outline">
                      {dish.sold}
                    </p>
                  </div>
                  <p className="font-label-lg text-label-lg font-bold text-primary">
                    {dish.price}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
