import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Crown,
  Flame,
  ReceiptText,
  UtensilsCrossed,
  Wallet,
  ArrowLeft
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import {
  PLACEHOLDER_IMAGE,
  formatPlacedAt,
  formatPrice,
  orderImage,
  orderPlacedAt,
  orderTimestamp,
  statusMeta,
} from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";
import type { OrderStateType, OrderType, PizzaType } from "@/app/type/type";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { fetchArray } from "@/lib/api";
import { auth } from "@/lib/auth";
import { getPremiumState } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Vendor dashboard — PizzaHub",
  description:
    "Your kitchen at a glance: menu items, incoming tickets, accepted orders and the plan you are on.",
};

const ACCEPTED_STATUSES: OrderStateType[] = [
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const formatMenuPrice = (price: PizzaType["price"]) => {
  const amount = typeof price === "number" ? price : Number(price);

  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "—";
};

type VendorStat = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  chipClassName: string;
  href?: string;
};

export default async function VendorDashboardPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const jwtToken = await auth.api.getToken({ headers: requestHeaders });
  const user = session?.user;
  const vendorId = user?.id ?? "";
  const firstName = user?.name?.split(" ")[0];

  const [menus, fetchedOrders] = await Promise.all([
    fetchArray<PizzaType>(`/menus/${vendorId}`, jwtToken.token),
    fetchArray<OrderType>(`/vendor_order/${vendorId}`, jwtToken.token),
  ]);

  // Newest first: the ObjectId prefix carries the creation timestamp.
  const menuItems = [...menus].sort(
    (a, b) => orderTimestamp(b._id) - orderTimestamp(a._id),
  );
  const orders = [...fetchedOrders].sort(
    (a, b) => orderTimestamp(b._id) - orderTimestamp(a._id),
  );

  const availableCount = menuItems.filter((item) => item.available).length;
  const pendingCount = orders.filter(
    (order) => order.order_status === "PENDING",
  ).length;
  const acceptedCount = orders.filter((order) =>
    ACCEPTED_STATUSES.includes(order.order_status),
  ).length;
  const premium = await getPremiumState(user?.id ?? "");

  const recentOrders = orders.slice(0, 5);
  const recentMenu = menuItems.slice(0, 4);

  const stats: VendorStat[] = [
    {
      label: "Total menu items",
      value: String(menuItems.length),
      hint: "Everything you publish",
      icon: UtensilsCrossed,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "Active menu items",
      value: String(availableCount),
      hint: "Marked available",
      icon: Flame,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Pending orders",
      value: String(pendingCount),
      hint: "Waiting for acceptance",
      icon: Clock3,
      chipClassName: "bg-crust-gold/20 text-secondary",
    },
    {
      label: "Accepted orders",
      value: String(acceptedCount),
      hint: "Confirmed or completed",
      icon: CheckCircle2,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
    {
      label: "Current plan",
      value: premium ? "Premium" : "Free",
      hint: premium ? "Billed monthly" : "Upgrade anytime",
      icon: premium ? Crown : Wallet,
      chipClassName: premium
        ? "bg-crust-gold/20 text-charcoal-dark"
        : "bg-surface-container-low text-on-surface-variant",
      href: "/vendor/dashboard/plan",
    },
  ];

  return (
    <div className="space-y-space-lg">
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Vendor studio
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Menus, kitchen tickets and your subscription plan in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
            href="/vendor/dashboard/order"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-space-sm sm:gap-space-md md:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const cardClassName =
            "block rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-lg";

          const body = (
            <>
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
            </>
          );

          return (
            <StaggerItem key={stat.label}>
              {stat.href ? (
                <Link
                  className={`${cardClassName} transition-colors hover:border-primary-container/50`}
                  href={stat.href}
                >
                  {body}
                </Link>
              ) : (
                <div className={cardClassName}>{body}</div>
              )}
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="grid gap-space-md xl:grid-cols-3" delay={0.1}>
        <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
            <div>
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Recent orders
              </h2>
              <p className="font-label-sm text-label-sm text-outline">
                {pendingCount === 0
                  ? "No new tickets waiting"
                  : `${pendingCount} ${
                      pendingCount === 1 ? "ticket" : "tickets"
                    } waiting for acceptance`}
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
              href="/vendor/dashboard/order"
            >
              All orders
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-outline">
                <ReceiptText size={22} />
              </span>
              <p className="font-title-md text-title-md text-charcoal-dark">
                No orders yet
              </p>
              <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
                New tickets appear here the moment a customer checks out.
              </p>
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
                      href={`/vendor/dashboard/order/${order._id}`}
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
                          {order.customer?.name || "Customer"}
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
          <section className="relative overflow-hidden rounded-2xl bg-charcoal-dark p-space-md text-surface-container-lowest shadow-lg">
            <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-crust-gold/15 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-space-xs rounded-full bg-crust-gold/20 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-crust-gold">
                <Crown size={12} />
                {premium ? "Premium plan" : "Free plan"}
              </span>
              <Wallet className="text-secondary-container" size={22} />
            </div>

            <p className="relative mt-space-sm font-headline-sm text-headline-sm">
              {premium ? "Premium" : "Free"}
            </p>
            <p className="relative font-label-sm text-label-sm text-surface-container-high/70">
              {premium
                ? "Featured placement and the Premium badge are live on your storefront."
                : "Upgrade for featured placement, the Premium badge and unlimited growth."}
            </p>

            <Link
              className="relative mt-space-md inline-flex items-center gap-space-xs font-label-lg text-label-lg font-bold text-crust-gold transition-colors hover:text-surface-container-lowest"
              href="/vendor/dashboard/plan"
            >
              Manage plan
              <ArrowRight size={14} />
            </Link>
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Menu snapshot
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crust-gold/20 text-charcoal-dark">
                <UtensilsCrossed size={16} />
              </span>
            </div>

            {recentMenu.length === 0 ? (
              <p className="mt-space-sm font-body-md text-body-md text-on-surface-variant">
                No dishes yet. Add your first menu item to get started.
              </p>
            ) : (
              <ul className="mt-space-sm space-y-space-sm">
                {recentMenu.map((item) => (
                  <li key={item._id}>
                    <Link
                      className="flex items-center gap-space-sm"
                      href={`/menu/${item._id}`}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                        <Image
                          alt={item.name}
                          className="object-cover"
                          fill
                          sizes="40px"
                          src={item.image || PLACEHOLDER_IMAGE}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                          {item.name}
                        </p>
                        <p className="truncate font-label-sm text-label-sm text-outline">
                          {formatMenuPrice(item.price)}
                          {item.status === "pending"
                            ? " · Pending review"
                            : item.available
                              ? " · Available"
                              : " · Sold out"}
                        </p>
                      </div>
                      <ArrowRight
                        className="shrink-0 text-outline-variant"
                        size={14}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link
              className="mt-space-md inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
              href="/vendor/dashboard/menu"
            >
              Edit menu
              <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
