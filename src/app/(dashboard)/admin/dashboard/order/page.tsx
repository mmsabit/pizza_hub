import {
  Bike,
  CheckCircle2,
  ReceiptText,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { formatPrice, orderTimestamp } from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";
import type { OrderType } from "@/app/type/type";

import { AdminOrderQueue } from "./_comp/admin-order-queue";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Orders — PizzaHub admin",
  description:
    "Every order placed across PizzaHub, searchable by ticket, customer, vendor or address.",
};

const isOpen = (order: OrderType) =>
  order.order_status !== "DELIVERED" && order.order_status !== "CANCELLED";

export default async function AdminOrderPage() {
  let fetchedOrders: OrderType[] = [];

  try {
    const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken.token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/`, {
      cache: "no-store",
      headers:{
        authorization: `Bearer ${token}`
      }
    }
  );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) fetchedOrders = data as OrderType[];
    }
  } catch {
    fetchedOrders = [];
  }

  const orders = [...fetchedOrders].sort(
    (a, b) => orderTimestamp(b._id) - orderTimestamp(a._id),
  );

  const openCount = orders.filter(isOpen).length;
  const onTheWay = orders.filter(
    (order) => order.order_status === "OUT_FOR_DELIVERY",
  ).length;
  const deliveredCount = orders.filter(
    (order) => order.order_status === "DELIVERED",
  ).length;
  const gross = orders
    .filter((order) => order.order_status !== "CANCELLED")
    .reduce((sum, order) => sum + Number(order.subtotal || 0), 0);

  const stats = [
    {
      label: "Orders on platform",
      value: String(orders.length),
      hint: `${openCount} still open`,
      icon: ReceiptText,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "On the way",
      value: String(onTheWay),
      hint: "Riders rolling right now",
      icon: Bike,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Delivered",
      value: String(deliveredCount),
      hint: "Closed tickets",
      icon: CheckCircle2,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
    {
      label: "Gross order value",
      value: formatPrice(gross),
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
            Platform orders
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Orders
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {orders.length === 0
              ? "No orders have been placed on PizzaHub yet."
              : `Watching ${orders.length} ${
                  orders.length === 1 ? "order" : "orders"
                } across every vendor on the platform.`}
          </p>
        </div>

        <Link
          className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          href="/admin/dashboard/menu"
        >
          <ReceiptText size={16} />
          Review menu
        </Link>
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

      <Reveal delay={0.1}>
        <AdminOrderQueue orders={orders} />
      </Reveal>
    </div>
  );
}
