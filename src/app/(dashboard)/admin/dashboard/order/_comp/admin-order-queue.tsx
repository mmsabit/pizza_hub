"use client";

import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  Phone,
  Pizza,
  Search,
  Store,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  formatPlacedAt,
  formatPrice,
  orderImage,
  orderPlacedAt,
  paymentLabel,
  statusMeta,
} from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";
import type { OrderStateType, OrderType } from "@/app/type/type";

const FILTERS = [
  { key: "all", label: "All", statuses: null },
  { key: "pending", label: "Pending", statuses: ["PENDING"] },
  { key: "preparing", label: "In the kitchen", statuses: ["CONFIRMED", "PREPARING"] },
  { key: "ready", label: "Ready", statuses: ["READY"] },
  { key: "delivery", label: "On the way", statuses: ["OUT_FOR_DELIVERY"] },
  { key: "delivered", label: "Delivered", statuses: ["DELIVERED"] },
  { key: "cancelled", label: "Cancelled", statuses: ["CANCELLED"] },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const searchable = (order: OrderType) =>
  [
    order._id,
    order.menuName,
    order.vendor?.name,
    order.customer?.name,
    order.customer?.phone,
    order.customer?.address,
    order.order_status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export function AdminOrderQueue({ orders }: { orders: OrderType[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(() => {
    const map = {} as Record<FilterKey, number>;

    for (const entry of FILTERS) {
      map[entry.key] =
        entry.statuses === null
          ? orders.length
          : orders.filter((order) =>
              (entry.statuses as readonly OrderStateType[]).includes(
                order.order_status,
              ),
            ).length;
    }

    return map;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const active = FILTERS.find((entry) => entry.key === filter);

    return orders.filter((order) => {
      const matchesStatus =
        !active ||
        active.statuses === null ||
        (active.statuses as readonly OrderStateType[]).includes(
          order.order_status,
        );
      if (!matchesStatus) return false;

      return needle === "" || searchable(order).includes(needle);
    });
  }, [orders, filter, query]);

  return (
    <section className="space-y-space-sm">
      <div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-sm shadow-sm sm:p-space-md">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-space-sm top-1/2 -translate-y-1/2 text-outline"
            size={18}
          />
          <input
            aria-label="Search orders"
            className="w-full rounded-xl border border-surface-container-high bg-surface-container-low py-space-sm pl-11 pr-11 font-body-md text-body-md text-charcoal-dark outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order id, customer, phone, vendor, dish or address…"
            type="search"
            value={query}
          />
          {query ? (
            <button
              aria-label="Clear search"
              className="absolute right-space-xs top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-high hover:text-charcoal-dark"
              onClick={() => setQuery("")}
              type="button"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        <nav
          aria-label="Filter orders by status"
          className="mt-space-sm flex flex-wrap gap-space-xs"
        >
          {FILTERS.map((entry) => {
            const active = entry.key === filter;

            return (
              <button
                key={entry.key}
                aria-pressed={active}
                className={
                  active
                    ? "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full bg-charcoal-dark px-space-sm py-space-xs font-label-md text-label-md text-surface-container-lowest shadow-sm"
                    : "inline-flex items-center gap-space-xs whitespace-nowrap rounded-full border border-surface-container-high bg-surface-container-lowest px-space-sm py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary-container/50 hover:text-primary"
                }
                onClick={() => setFilter(entry.key)}
                type="button"
              >
                {entry.label}
                <span
                  className={
                    active
                      ? "rounded-full bg-surface-container-lowest/15 px-1.5 font-label-sm text-label-sm"
                      : "rounded-full bg-surface-container-low px-1.5 font-label-sm text-label-sm text-outline"
                  }
                >
                  {counts[entry.key]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <p className="px-1 font-label-sm text-label-sm text-outline">
        {visibleOrders.length === 1
          ? "1 order matches"
          : `${visibleOrders.length} orders match`}
        {query.trim() ? ` “${query.trim()}”` : ""}
      </p>

      {visibleOrders.length === 0 ? (
        <div className="flex flex-col items-center gap-space-sm rounded-3xl border border-dashed border-outline-variant/70 bg-surface-container-lowest px-space-md py-space-xl text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
            <Pizza size={26} />
          </span>
          <p className="font-title-md text-title-md text-charcoal-dark">
            {orders.length === 0 ? "No orders yet" : "No orders match"}
          </p>
          <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
            {orders.length === 0
              ? "As soon as a customer checks out, the ticket will show up here."
              : "Try a different keyword or switch the status filter back to all orders."}
          </p>
          {orders.length > 0 ? (
            <button
              className="mt-space-xs inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              type="button"
            >
              Clear filters
              <X size={14} />
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="flex flex-col gap-space-sm">
          {visibleOrders.map((order) => {
            const status = statusMeta(order.order_status);
            const placedAt = orderPlacedAt(order._id);
            const quantity = Number(order.quantity) || 0;

            return (
              <li key={order._id}>
                <Link
                  className="group block overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm transition-all hover:border-primary-container/40 hover:shadow-md"
                  href={`/admin/dashboard/order/${order._id}`}
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
                          <p className="truncate font-title-md text-title-md text-charcoal-dark">
                            {order.menuName}
                          </p>
                          <p className="font-label-sm text-label-sm text-outline">
                            {quantity} × {formatPrice(Number(order.unitPrice))} ·{" "}
                            <span className="font-mono text-[11px]">
                              #{order._id.slice(-6).toUpperCase()}
                            </span>
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
                            {order.vendor?.name || "Unknown vendor"}
                          </span>
                        </span>
                        <span className="inline-flex min-w-0 items-center gap-1">
                          <Phone className="shrink-0" size={12} />
                          <span className="truncate">
                            {order.customer?.name || "Customer"}
                            {order.customer?.phone
                              ? ` · ${order.customer.phone}`
                              : ""}
                          </span>
                        </span>
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

                      <p className="mt-space-xs flex min-w-0 items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
                        <MapPin className="shrink-0 text-outline" size={13} />
                        <span className="truncate">
                          {order.customer?.address || "Address not provided"}
                        </span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-end justify-between gap-space-sm border-t border-surface-container-high pt-space-sm sm:items-center lg:w-44 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-space-md lg:pt-0">
                      <div className="sm:text-left lg:text-right">
                        <p className="font-label-sm text-label-sm text-outline">
                          Order total
                        </p>
                        <p className="font-headline-sm text-headline-sm font-bold text-charcoal-dark">
                          {formatPrice(Number(order.subtotal))}
                        </p>
                        <p className="inline-flex items-center gap-1 font-label-sm text-label-sm text-outline">
                          <CreditCard size={12} />
                          {paymentLabel(order.payment)}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-charcoal-dark px-space-sm py-2 font-label-sm text-label-sm text-surface-container-lowest transition-colors group-hover:bg-primary-container">
                        View details
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
