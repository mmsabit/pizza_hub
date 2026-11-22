import {
  ArrowRight,
  Bike,
  CalendarDays,
  Flame,
  Gift,
  MapPin,
  Plus,
  ReceiptText,
  Timer,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard — PizzaHub",
  description:
    "Track live deliveries, review recent wood-fired orders and keep an eye on your crust rewards.",
};

const STATS = [
  {
    label: "Total orders",
    value: "48",
    hint: "+12% vs last month",
    icon: ReceiptText,
    chipClassName: "bg-primary-fixed text-primary",
  },
  {
    label: "Crust points",
    value: "1,240",
    hint: "340 until a free pie",
    icon: Gift,
    chipClassName: "bg-crust-gold/20 text-charcoal-dark",
  },
  {
    label: "Avg. delivery",
    value: "24 min",
    hint: "4 min faster than last month",
    icon: Timer,
    chipClassName: "bg-tertiary-fixed text-tertiary",
  },
  {
    label: "Saved addresses",
    value: "3",
    hint: "2 home • 1 office",
    icon: MapPin,
    chipClassName: "bg-secondary-fixed text-secondary",
  },
];

const ORDERS = [
  {
    id: "#PH-4821",
    items: "Margherita Pizza + Garlic Knots",
    image: "/images/menu-margherita.jpg",
    status: "Delivered",
    total: "$32.40",
    placed: "Today, 19:12",
    deliveryDate: "22 November 2026",
    statusClassName: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    id: "#PH-4820",
    items: "Double Pepperoni Picante",
    image: "/images/menu-seafood.jpg",
    status: "Out for delivery",
    total: "$28.50",
    placed: "Today, 18:47",
    deliveryDate: "22 November 2026",
    statusClassName: "bg-secondary-fixed text-on-secondary-fixed-variant",
  },
  {
    id: "#PH-4819",
    items: "Truffle Wild Mushroom",
    image: "/images/menu-caesar.jpg",
    status: "In the oven",
    total: "$34.00",
    placed: "Today, 18:20",
    deliveryDate: "22 November 2026",
    statusClassName: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    id: "#PH-4818",
    items: "Caesar Salad + Rum with Soda",
    image: "/images/menu-rum.jpg",
    status: "Delivered",
    total: "$21.10",
    placed: "Yesterday, 20:05",
    deliveryDate: "21 November 2026",
    statusClassName: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
];

const REWARDS_HISTORY = [
  { label: "Order #PH-4818", points: "+21" },
  { label: "Referral bonus", points: "+150" },
  { label: "Order #PH-4795", points: "+18" },
];

export default async function UserDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
            Tuesday, 17 November
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            {firstName ? `Good evening, ${firstName}` : "Good evening"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Here&apos;s what&apos;s been cooking across your last 30 days.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            href="#recent-orders"
          >
            <ReceiptText size={16} />
            Track orders
          </Link>
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
            href="/"
          >
            <Plus size={16} />
            New order
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
        <section
          id="recent-orders"
          className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm xl:col-span-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
            <div>
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Recent orders
              </h2>
              <p className="font-label-sm text-label-sm text-outline">
                Last 4 wood-fired bakes
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
              href="#"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="divide-y divide-surface-container-high">
            {ORDERS.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center gap-space-sm px-space-md py-space-md transition-colors hover:bg-surface-container-low"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-container-low">
                  <Image
                    alt={order.items}
                    className="object-cover"
                    fill
                    sizes="44px"
                    src={order.image}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                    {order.id}
                  </p>
                  <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                    {order.items}
                  </p>
                </div>

                <div className="flex w-full items-center justify-between gap-space-sm pl-14 sm:w-auto sm:justify-end sm:gap-space-md sm:pl-0">
                  <span
                    className={`whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${order.statusClassName}`}
                  >
                    {order.status}
                  </span>

                  <div className="text-right">
                    <p className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                      {order.total}
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">
                      {order.placed}
                    </p>
                    <p className="inline-flex items-center gap-1 font-label-sm text-label-sm text-outline">
                      <CalendarDays size={12} />
                      Delivery {order.deliveryDate}
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
                On the way
              </span>
              <Bike className="text-secondary-container" size={22} />
            </div>

            <p className="mt-space-sm font-headline-sm text-headline-sm">
              12 min to your door
            </p>
            <p className="font-label-sm text-label-sm text-surface-container-high/70">
              Order #PH-4820 • Marco is riding through Downtown Brooklyn
            </p>

            <div className="mt-space-md">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-surface-container-high/70">
                <span>Stone oven</span>
                <span>Your address</span>
              </div>
              <div className="mt-space-xs h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest/15">
                <div className="h-full w-2/3 rounded-full bg-secondary-container" />
              </div>
            </div>

            <div className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm text-crust-gold">
              <Flame size={14} />
              Thermal bag holding at 74°C
            </div>
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Crust rewards
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crust-gold/20 text-charcoal-dark">
                <Gift size={16} />
              </span>
            </div>

            <p className="mt-space-sm font-headline-md text-headline-md text-charcoal-dark">
              7 of 10 pies
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              3 more orders unlock a free artisan pie.
            </p>

            <div className="mt-space-sm flex gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index < 7
                      ? "h-2 flex-1 rounded-full bg-primary-container"
                      : "h-2 flex-1 rounded-full bg-surface-container-high"
                  }
                />
              ))}
            </div>

            <ul className="mt-space-md space-y-space-xs border-t border-surface-container-high pt-space-sm">
              {REWARDS_HISTORY.map((entry) => (
                <li
                  key={entry.label}
                  className="flex items-center justify-between font-label-sm text-label-sm"
                >
                  <span className="text-on-surface-variant">{entry.label}</span>
                  <span className="font-bold text-tertiary">{entry.points}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
