import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Pizza,
  Plus,
  ReceiptText,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import {
  formatPlacedAt,
  formatPrice,
  orderImage,
  orderPlacedAt,
  orderTimestamp,
  statusMeta,
} from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";
import type { OrderStateType, OrderType } from "@/app/type/type";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { fetchArray } from "@/lib/api";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard — PizzaHub",
  description:
    "Your PizzaHub order history at a glance: total, pending, accepted and rejected orders.",
};

const ACCEPTED_STATUSES: OrderStateType[] = [
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

type UserStat = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  chipClassName: string;
};

export default async function UserDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0];

  const fetchedOrders = await fetchArray<OrderType>(
    `/customer_order/${user?.id ?? ""}`,
  );

  // Newest first: the ObjectId prefix carries the creation timestamp.
  const orders = [...fetchedOrders].sort(
    (a, b) => orderTimestamp(b._id) - orderTimestamp(a._id),
  );

  const pendingCount = orders.filter(
    (order) => order.order_status === "PENDING",
  ).length;
  const acceptedCount = orders.filter((order) =>
    ACCEPTED_STATUSES.includes(order.order_status),
  ).length;
  const rejectedCount = orders.filter(
    (order) => order.order_status === "CANCELLED",
  ).length;

  const recentOrders = orders.slice(0, 5);

  const stats: UserStat[] = [
    {
      label: "Total orders",
      value: String(orders.length),
      hint: "All time",
      icon: ReceiptText,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "Pending",
      value: String(pendingCount),
      hint: "Waiting for the kitchen",
      icon: Clock3,
      chipClassName: "bg-crust-gold/20 text-secondary",
    },
    {
      label: "Accepted",
      value: String(acceptedCount),
      hint: "Confirmed or completed",
      icon: CheckCircle2,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Rejected",
      value: String(rejectedCount),
      hint: "Cancelled orders",
      icon: XCircle,
      chipClassName: "bg-error-container text-on-error-container",
    },
  ];

  const breakdown = [
    {
      label: "Pending",
      count: pendingCount,
      barClassName: "bg-crust-gold",
      dotClassName: "bg-crust-gold",
    },
    {
      label: "Accepted",
      count: acceptedCount,
      barClassName: "bg-tertiary",
      dotClassName: "bg-tertiary",
    },
    {
      label: "Rejected",
      count: rejectedCount,
      barClassName: "bg-error",
      dotClassName: "bg-error",
    },
  ];

  return (
    <div className="space-y-space-lg">
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Customer studio
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {orders.length === 0
              ? "Your order history starts with your first slice."
              : `${orders.length} ${
                  orders.length === 1 ? "order" : "orders"
                } tracked across every kitchen on PizzaHub.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            href="/user/dashboard/order"
          >
            <ReceiptText size={16} />
            All orders
          </Link>
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
            href="/"
          >
            <Plus size={16} />
            New order
          </Link>
        </div>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-space-sm sm:gap-space-md xl:grid-cols-4">
        {stats.map((stat) => (
          <StaggerItem
            key={stat.label}
            className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-lg"
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
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="grid gap-space-md xl:grid-cols-3" delay={0.1}>
        <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
            <div>
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Recent orders
              </h2>
              <p className="font-label-sm text-label-sm text-outline">
                Your latest tickets, newest first
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
              href="/user/dashboard/order"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-outline">
                <Pizza size={22} />
              </span>
              <p className="font-title-md text-title-md text-charcoal-dark">
                No orders yet
              </p>
              <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
                Your first order will appear here as soon as it reaches the
                kitchen.
              </p>
              <Link
                className="mt-space-xs inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
                href="/"
              >
                Browse the menu
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-surface-container-high">
              {recentOrders.map((order) => {
                const status = statusMeta(order.order_status);
                const placedAt = orderPlacedAt(order._id);

                return (
                  <li key={order._id}>
                    <Link
                      className="flex flex-wrap items-center gap-space-sm px-space-md py-space-md transition-colors hover:bg-surface-container-low"
                      href={`/user/dashboard/order/${order._id}`}
                    >
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                        <Image
                          alt={order.menuName}
                          className="object-cover"
                          fill
                          sizes="44px"
                          src={orderImage(order)}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                          {order.menuName}
                        </p>
                        <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                          {order.vendor?.name || "PizzaHub kitchen"}
                          {placedAt ? ` · ${formatPlacedAt(placedAt)}` : ""}
                        </p>
                      </div>

                      <span
                        className={`whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${status.chipClassName}`}
                      >
                        {status.label}
                      </span>

                      <div className="text-right">
                        <p className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                          {formatPrice(Number(order.subtotal))}
                        </p>
                        <p className="font-label-sm text-label-sm text-outline">
                          {order.quantity} ×{" "}
                          {formatPrice(Number(order.unitPrice))}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="space-y-space-md">
          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Order breakdown
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <ReceiptText size={16} />
              </span>
            </div>

            <p className="mt-space-sm font-headline-md text-headline-md text-charcoal-dark">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Every status across your account.
            </p>

            <div
              aria-hidden="true"
              className="mt-space-md flex h-2 overflow-hidden rounded-full bg-surface-container-high"
            >
              {orders.length > 0
                ? breakdown.map((segment) =>
                    segment.count > 0 ? (
                      <span
                        key={segment.label}
                        className={`h-full ${segment.barClassName}`}
                        style={{
                          width: `${(segment.count / orders.length) * 100}%`,
                        }}
                      />
                    ) : null,
                  )
                : null}
            </div>

            <ul className="mt-space-sm space-y-space-xs">
              {breakdown.map((segment) => (
                <li
                  key={segment.label}
                  className="flex items-center justify-between font-label-sm text-label-sm"
                >
                  <span className="inline-flex items-center gap-2 text-on-surface-variant">
                    <span
                      className={`h-2 w-2 rounded-full ${segment.dotClassName}`}
                    />
                    {segment.label}
                  </span>
                  <span className="font-bold text-charcoal-dark">
                    {segment.count}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-charcoal-dark p-space-md text-surface-container-lowest shadow-lg">
            <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-crust-gold/15 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-space-xs rounded-full bg-basil-fresh/15 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-basil-fresh">
                <span className="h-1.5 w-1.5 rounded-full bg-basil-fresh" />
                Fresh from the oven
              </span>
              <Pizza className="text-secondary-container" size={22} />
            </div>

            <p className="relative mt-space-sm font-headline-sm text-headline-sm">
              Hungry again?
            </p>
            <p className="relative font-label-sm text-label-sm text-surface-container-high/70">
              Browse the menu and send another ticket to the kitchen.
            </p>

            <Link
              className="relative mt-space-md inline-flex items-center gap-space-xs font-label-lg text-label-lg font-bold text-crust-gold transition-colors hover:text-surface-container-lowest"
              href="/menu"
            >
              Browse menu
              <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
