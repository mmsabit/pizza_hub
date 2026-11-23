import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Flame,
  MapPin,
  Phone,
  Pizza,
  Plus,
  ReceiptText,
  Store,
  Wallet,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import type { OrderStateType, OrderType } from "@/app/type/type";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { auth } from "@/lib/auth";
import { CancelOrderButton } from "./_comp/cancel-order-button";
import {
  ACTIVE_STATUSES,
  STATUS_STEPS,
  formatPlacedAt,
  formatPrice,
  orderImage,
  orderPlacedAt,
  orderTimestamp,
  paymentLabel,
  statusMeta,
  statusProgress,
  statusStepIndex,
} from "./_comp/order-ui";

export const metadata: Metadata = {
  title: "Orders — PizzaHub",
  description:
    "Follow every wood-fired order from the stone oven to your doorstep.",
};

type OrderWithImage = OrderType & { menuImage?: string };

const FILTERS = [
  { key: "all", label: "All", statuses: null },
  { key: "pending", label: "Pending", statuses: ["PENDING"] },
  { key: "active", label: "In progress", statuses: ACTIVE_STATUSES },
  { key: "delivered", label: "Delivered", statuses: ["DELIVERED"] },
  { key: "cancelled", label: "Cancelled", statuses: ["CANCELLED"] },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const isFilterKey = (value: string | undefined): value is FilterKey =>
  Boolean(value) && FILTERS.some((filter) => filter.key === value);

const filterHref = (key: FilterKey) =>
  key === "all"
    ? "/user/dashboard/order"
    : `/user/dashboard/order?status=${key}`;

const matchesFilter = (order: OrderType, key: FilterKey) => {
  const filter = FILTERS.find((entry) => entry.key === key);

  if (!filter || filter.statuses === null) return true;

  return (filter.statuses as readonly OrderStateType[]).includes(
    order.order_status,
  );
};

export default async function CustomerOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const { status: requestedStatus } = await searchParams;
  const activeFilter: FilterKey = isFilterKey(requestedStatus)
    ? requestedStatus
    : "all";

  let fetchedOrders: OrderWithImage[] = [];
const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken.token

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customer_order/${user?.id ?? ""}`,
      { cache: "no-store",
        headers:{
        authorization: `Bearer ${token}`
      }
       },
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) fetchedOrders = data as OrderWithImage[];
    }
  } catch {
    fetchedOrders = [];
  }

  // Newest first: the ObjectId prefix carries the creation timestamp.
  const orders = [...fetchedOrders].sort(
    (a, b) => orderTimestamp(b._id) - orderTimestamp(a._id),
  );

  const pendingCount = orders.filter(
    (order) => order.order_status === "PENDING",
  ).length;
  const activeCount = orders.filter((order) =>
    ACTIVE_STATUSES.includes(order.order_status),
  ).length;
  const deliveredCount = orders.filter(
    (order) => order.order_status === "DELIVERED",
  ).length;
  const totalSpent = orders
    .filter((order) => order.order_status !== "CANCELLED")
    .reduce((sum, order) => sum + Number(order.subtotal || 0), 0);

  const visibleOrders = orders.filter((order) =>
    matchesFilter(order, activeFilter),
  );

  const liveOrder = orders.find(
    (order) =>
      order.order_status !== "DELIVERED" &&
      order.order_status !== "CANCELLED",
  );
  const liveStatus = liveOrder
    ? statusMeta(liveOrder.order_status)
    : statusMeta("PENDING");
  const liveProgress = liveOrder
    ? statusProgress(liveOrder.order_status)
    : 0;
  const liveStep = liveOrder
    ? Math.max(statusStepIndex(liveOrder.order_status) + 1, 1)
    : 0;
  const livePlacedAt = liveOrder ? orderPlacedAt(liveOrder._id) : null;

  const filterCounts: Record<FilterKey, number> = {
    all: orders.length,
    pending: pendingCount,
    active: activeCount,
    delivered: deliveredCount,
    cancelled: orders.filter((order) => order.order_status === "CANCELLED")
      .length,
  };

  const stats = [
    {
      label: "Total orders",
      value: String(orders.length),
      hint: "All time",
      icon: ReceiptText,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "Open orders",
      value: String(activeCount + pendingCount),
      hint: pendingCount
        ? `${pendingCount} awaiting confirmation`
        : "Kitchen is on it",
      icon: Flame,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
    {
      label: "Delivered",
      value: String(deliveredCount),
      hint: "Bakes that made it home",
      icon: CheckCircle2,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Total spent",
      value: formatPrice(totalSpent),
      hint: "Cancelled excluded",
      icon: Wallet,
      chipClassName: "bg-crust-gold/20 text-charcoal-dark",
    },
  ];

  return (
    <div className="space-y-space-lg">
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Order dispatcher
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Your orders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {orders.length === 0
              ? "Nothing has left the stone oven for you yet."
              : `${orders.length} wood-fired ${
                  orders.length === 1 ? "order" : "orders"
                } · ${pendingCount + activeCount} still in play`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            href="/user/dashboard"
          >
            <ReceiptText size={16} />
            Dashboard
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
            <div className="flex items-start justify-between gap-space-sm">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.chipClassName}`}
              >
                <stat.icon size={20} />
              </span>
            </div>
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

      {liveOrder ? (
        <Reveal
          as="section"
          className="relative overflow-hidden rounded-3xl bg-charcoal-dark p-space-md text-surface-container-lowest shadow-lg sm:p-space-lg"
          delay={0.08}
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-container/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-crust-gold/10 blur-3xl" />

          <div className="relative flex flex-wrap items-start justify-between gap-space-md">
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-surface-container-lowest/10 ring-1 ring-surface-container-lowest/15">
                <Image
                  alt={liveOrder.menuName}
                  className="object-cover"
                  fill
                  sizes="56px"
                  src={orderImage(liveOrder)}
                />
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest/10 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-crust-gold">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${liveStatus.dotClassName}`}
                  />
                  {liveStatus.label}
                </span>
                <h2 className="mt-1 truncate font-headline-sm text-headline-sm">
                  {liveOrder.menuName}
                </h2>
                <p className="truncate font-label-sm text-label-sm text-surface-container-high/70">
                  {liveOrder.vendor?.name || "PizzaHub kitchen"}
                  {livePlacedAt ? ` · ${formatPlacedAt(livePlacedAt)}` : ""}
                </p>
              </div>
            </div>

            <Link
              className="inline-flex items-center gap-space-xs rounded-xl bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-charcoal-dark transition-colors hover:bg-crust-gold"
              href={`/user/dashboard/order/${liveOrder._id}`}
            >
              Track order
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="relative mt-space-md">
            <div className="flex items-center justify-between font-label-sm text-label-sm text-surface-container-high/70">
              <span>Order placed</span>
              <span>At your door</span>
            </div>
            <div
              aria-label="Order progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={liveProgress}
              className="mt-space-xs h-2 w-full overflow-hidden rounded-full bg-surface-container-lowest/15"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-secondary-container transition-all duration-500"
                style={{ width: `${Math.max(liveProgress, 4)}%` }}
              />
            </div>
            <p className="mt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-crust-gold">
              <Flame size={13} />
              Step {liveStep} of {STATUS_STEPS.length} ·{" "}
              {liveStatus.description}
            </p>
          </div>
        </Reveal>
      ) : null}

      <Reveal as="section" className="space-y-space-sm" delay={0.1}>
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <nav aria-label="Filter orders" className="flex flex-wrap gap-space-xs">
            {FILTERS.map((filter) => {
              const active = filter.key === activeFilter;

              return (
                <Link
                  key={filter.key}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full bg-charcoal-dark px-space-sm py-space-xs font-label-md text-label-md text-surface-container-lowest shadow-sm"
                      : "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full border border-surface-container-high bg-surface-container-lowest px-space-sm py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary-container/50 hover:text-primary"
                  }
                  href={filterHref(filter.key)}
                >
                  {filter.label}
                  <span
                    className={
                      active
                        ? "rounded-full bg-surface-container-lowest/15 px-1.5 font-label-sm text-label-sm"
                        : "rounded-full bg-surface-container-low px-1.5 font-label-sm text-label-sm text-outline"
                    }
                  >
                    {filterCounts[filter.key]}
                  </span>
                </Link>
              );
            })}
          </nav>

          <p className="font-label-sm text-label-sm text-outline">
            {visibleOrders.length === 1
              ? "1 order"
              : `${visibleOrders.length} orders`}
          </p>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-space-sm rounded-3xl border border-dashed border-outline-variant/70 bg-surface-container-lowest px-space-md py-space-xl text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
              <Pizza size={26} />
            </span>
            <p className="font-title-md text-title-md text-charcoal-dark">
              {orders.length === 0 ? "No orders yet" : "Nothing in this lane"}
            </p>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              {orders.length === 0
                ? "Your first order will show up here the moment it reaches the kitchen."
                : "No orders match this status — jump back to the full history."}
            </p>
            <Link
              className="mt-space-xs inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
              href={orders.length === 0 ? "/" : "/user/dashboard/order"}
            >
              {orders.length === 0 ? "Browse the menu" : "View all orders"}
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-space-sm">
            {visibleOrders.map((order) => {
              const status = statusMeta(order.order_status);
              const placedAt = orderPlacedAt(order._id);

              return (
                <li
                  key={order._id}
                  className="group overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm transition-all hover:border-primary-container/40 hover:shadow-md"
                >
                  <div className="flex flex-col gap-space-md p-space-md lg:flex-row lg:items-center">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface-container-low">
                      <Image
                        alt={order.menuName}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        fill
                        sizes="80px"
                        src={orderImage(order)}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-space-xs">
                        <p className="min-w-0 truncate font-title-md text-title-md text-charcoal-dark">
                          {order.menuName}
                        </p>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${status.chipClassName}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                          />
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-space-sm gap-y-1 font-label-sm text-label-sm text-outline">
                        <span className="inline-flex min-w-0 items-center gap-1">
                          <Store className="shrink-0" size={12} />
                          <span className="truncate">
                            {order.vendor?.name || "Vendor unavailable"}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ReceiptText size={12} />
                        </span>
                        {placedAt ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={12} />
                            {formatPlacedAt(placedAt)}
                          </span>
                        ) : null}
                      </p>

                      <div className="mt-space-sm space-y-1 font-label-sm text-label-sm text-on-surface-variant">
                        <p className="flex min-w-0 items-center gap-1.5">
                          <MapPin className="shrink-0 text-outline" size={13} />
                          <span className="truncate">
                            {order.customer?.address || "Address not provided"}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-x-space-md gap-y-1">
                          <p className="flex items-center gap-1.5">
                            <CreditCard
                              className="shrink-0 text-outline"
                              size={13}
                            />
                            {paymentLabel(order.payment)}
                          </p>
                          {order.customer?.phone ? (
                            <p className="flex items-center gap-1.5">
                              <Phone
                                className="shrink-0 text-outline"
                                size={13}
                              />
                              {order.customer.phone}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {order.customer?.note ? (
                        <p className="mt-space-sm rounded-xl border-l-2 border-crust-gold/60 bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm italic text-on-surface-variant">
                          “{order.customer.note}”
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-col gap-space-sm border-t border-surface-container-high pt-space-sm sm:flex-row sm:items-end sm:justify-between lg:w-52 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-space-md lg:pt-0">
                      <div className="sm:text-left lg:text-right">
                        <p className="font-label-sm text-label-sm text-outline">
                          {order.quantity} ×{" "}
                          {formatPrice(Number(order.unitPrice))}
                        </p>
                        <p className="font-headline-sm text-headline-sm font-bold text-charcoal-dark">
                          {formatPrice(Number(order.subtotal))}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-space-xs sm:justify-end">
                        <CancelOrderButton compact order={order} />
                        <Link
                          className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal-dark px-space-sm py-2 font-label-sm text-label-sm text-surface-container-lowest transition-colors hover:bg-primary-container"
                          href={`/user/dashboard/order/${order._id}`}
                        >
                          View details
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Reveal>

      <Reveal
        as="p"
        className="flex items-center justify-center gap-space-xs text-center font-label-sm text-label-sm text-outline"
        delay={0.15}
      >
        <XCircle className="shrink-0 text-outline-variant" size={13} />
        Need to change an order? Call the kitchen — status updates are handled by
        the vendor.
      </Reveal>
    </div>
  );
}
