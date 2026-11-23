import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChefHat,
  Clock3,
  CreditCard,
  Flame,
  MapPin,
  Phone,
  Pizza,
  ReceiptText,
  Store,
  Timer,
  Wallet,
  ArrowLeft
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
  paymentLabel,
  statusMeta,
} from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";
import type { OrderStateType, OrderType } from "@/app/type/type";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Kitchen tickets — PizzaHub",
  description:
    "Work every incoming PizzaHub ticket from the pass: accept, bake, box and hand off.",
};

const KITCHEN_STATUSES: OrderStateType[] = ["CONFIRMED", "PREPARING"];

const FILTERS = [
  { key: "all", label: "All", statuses: null },
  { key: "new", label: "New", statuses: ["PENDING"] },
  { key: "kitchen", label: "Kitchen", statuses: KITCHEN_STATUSES },
  { key: "ready", label: "Ready", statuses: ["READY"] },
  { key: "delivery", label: "On the way", statuses: ["OUT_FOR_DELIVERY"] },
  { key: "delivered", label: "Delivered", statuses: ["DELIVERED"] },
  { key: "cancelled", label: "Cancelled", statuses: ["CANCELLED"] },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const isFilterKey = (value: string | undefined): value is FilterKey =>
  Boolean(value) && FILTERS.some((filter) => filter.key === value);

const filterHref = (key: FilterKey) =>
  key === "all"
    ? "/vendor/dashboard/order"
    : `/vendor/dashboard/order?status=${key}`;

const matchesFilter = (order: OrderType, key: FilterKey) => {
  const filter = FILTERS.find((entry) => entry.key === key);

  if (!filter || filter.statuses === null) return true;

  return (filter.statuses as readonly OrderStateType[]).includes(
    order.order_status,
  );
};

export default async function VendorOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const vendorId = session?.user?.id ?? "";
  const { status: requestedStatus } = await searchParams;
  const activeFilter: FilterKey = isFilterKey(requestedStatus)
    ? requestedStatus
    : "all";

  let fetchedOrders: OrderType[] = [];
const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken.token
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor_order/${vendorId}`,
      { cache: "no-store",
        headers:{
        authorization: `Bearer ${token}`
      }
       },
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) fetchedOrders = data as OrderType[];
    }
  } catch {
    fetchedOrders = [];
  }

  // Newest first: the ObjectId prefix carries the creation timestamp.
  const orders = [...fetchedOrders].sort(
    (a, b) => orderTimestamp(b._id) - orderTimestamp(a._id),
  );

  const newCount = orders.filter(
    (order) => order.order_status === "PENDING",
  ).length;
  const kitchenCount = orders.filter((order) =>
    KITCHEN_STATUSES.includes(order.order_status),
  ).length;
  const readyCount = orders.filter(
    (order) => order.order_status === "READY",
  ).length;
  const openCount = orders.filter(
    (order) =>
      order.order_status !== "DELIVERED" && order.order_status !== "CANCELLED",
  ).length;
  const takings = orders
    .filter((order) => order.order_status !== "CANCELLED")
    .reduce((sum, order) => sum + Number(order.subtotal || 0), 0);

  const visibleOrders = orders.filter((order) =>
    matchesFilter(order, activeFilter),
  );

  const filterCounts: Record<FilterKey, number> = {
    all: orders.length,
    new: newCount,
    kitchen: kitchenCount,
    ready: readyCount,
    delivery: orders.filter(
      (order) => order.order_status === "OUT_FOR_DELIVERY",
    ).length,
    delivered: orders.filter((order) => order.order_status === "DELIVERED")
      .length,
    cancelled: orders.filter((order) => order.order_status === "CANCELLED")
      .length,
  };

  const stats = [
    {
      label: "Tickets on the pass",
      value: String(openCount),
      hint: newCount ? `${newCount} awaiting acceptance` : "Nothing unclaimed",
      icon: ReceiptText,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "In the oven",
      value: String(kitchenCount),
      hint: "Confirmed and baking",
      icon: Flame,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
    {
      label: "Boxed & ready",
      value: String(readyCount),
      hint: "Waiting for a rider",
      icon: Timer,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Ticket revenue",
      value: formatPrice(takings),
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
            Kitchen pass
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Orders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {orders.length === 0
              ? "No tickets have landed on your storefront yet."
              : `${orders.length} ${
                  orders.length === 1 ? "ticket" : "tickets"
                } on your storefront · ${openCount} still open`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
            href="/"
          >
            <ArrowLeft size={16} />
            Back to Home
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

      <Reveal as="section" className="space-y-space-sm" delay={0.1}>
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <nav
            aria-label="Filter tickets"
            className="flex flex-wrap gap-space-xs"
          >
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
              ? "1 ticket"
              : `${visibleOrders.length} tickets`}
          </p>
        </div>

        {visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-space-sm rounded-3xl border border-dashed border-outline-variant/70 bg-surface-container-lowest px-space-md py-space-xl text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
              <Pizza size={26} />
            </span>
            <p className="font-title-md text-title-md text-charcoal-dark">
              {orders.length === 0
                ? "The pass is clear"
                : "Nothing in this lane"}
            </p>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              {orders.length === 0
                ? "Every new order for your kitchen will appear here the moment a customer checks out."
                : "No tickets match this status — jump back to the full queue."}
            </p>
            <Link
              className="mt-space-xs inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
              href={
                orders.length === 0
                  ? "/vendor/dashboard/menu"
                  : "/vendor/dashboard/order"
              }
            >
              {orders.length === 0 ? "Review your menu" : "View all tickets"}
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-space-sm">
            {visibleOrders.map((order) => {
              const status = statusMeta(order.order_status);
              const placedAt = orderPlacedAt(order._id);
              const quantity = Number(order.quantity) || 0;
              const isNew = order.order_status === "PENDING";

              return (
                <li
                  key={order._id}
                  className={`group overflow-hidden rounded-2xl border bg-surface-container-lowest shadow-sm transition-all hover:shadow-md ${
                    isNew
                      ? "border-primary-container/50"
                      : "border-surface-container-high hover:border-primary-container/40"
                  }`}
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
                        <div className="min-w-0">
                          <p className="min-w-0 truncate font-title-md text-title-md text-charcoal-dark">
                            {order.menuName}
                          </p>
                          <p className="font-label-sm text-label-sm text-outline">
                            {quantity} × {formatPrice(Number(order.unitPrice))}
                          </p>
                        </div>
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
                            {order.customer?.name || "Customer"}
                          </span>
                        </span>
                        {order.customer?.phone ? (
                          <span className="inline-flex items-center gap-1">
                            <Phone size={12} />
                            {order.customer.phone}
                          </span>
                        ) : null}
                        {placedAt ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={12} />
                            {formatPlacedAt(placedAt)}
                          </span>
                        ) : null}
                        {order.deliveryDate ? (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={12} />
                            Delivery {order.deliveryDate}
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
                        <p className="flex items-center gap-1.5">
                          <CreditCard
                            className="shrink-0 text-outline"
                            size={13}
                          />
                          {paymentLabel(order.payment)}
                        </p>
                      </div>

                      {order.customer?.note ? (
                        <p className="mt-space-sm rounded-xl border-l-2 border-crust-gold/60 bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm italic text-on-surface-variant">
                          “{order.customer.note}”
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-col gap-space-sm border-t border-surface-container-high pt-space-sm sm:flex-row sm:items-end sm:justify-between lg:w-48 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-space-md lg:pt-0">
                      <div className="sm:text-left lg:text-right">
                        <p className="font-label-sm text-label-sm text-outline">
                          Ticket total
                        </p>
                        <p className="font-headline-sm text-headline-sm font-bold text-charcoal-dark">
                          {formatPrice(Number(order.subtotal))}
                        </p>
                      </div>

                      <Link
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-charcoal-dark px-space-sm py-2 font-label-sm text-label-sm text-surface-container-lowest transition-colors hover:bg-primary-container"
                        href={`/vendor/dashboard/order/${order._id}`}
                      >
                        {isNew ? "Accept ticket" : "Manage order"}
                        <ArrowUpRight size={13} />
                      </Link>
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
        <ChefHat className="shrink-0 text-outline-variant" size={13} />
        Status changes are posted from the ticket page and reach the customer
        instantly.
      </Reveal>
    </div>
  );
}
