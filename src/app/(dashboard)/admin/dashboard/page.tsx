import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  Crown,
  Store,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import {
  PLACEHOLDER_IMAGE,
  formatPlacedAt,
  orderPlacedAt,
  orderTimestamp,
} from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";
import type { PizzaType } from "@/app/type/type";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { fetchArray } from "@/lib/api";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin dashboard — PizzaHub",
  description:
    "Live platform totals for registered accounts, vendors, customers, menus and verified payments.",
};

type Account = {
  _id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  premium?: boolean | null;
  createdAt?: string | null;
};

type Payment = {
  _id: string;
  client_reference_id: string;
  status?: string | null;
  payment_status?: string | null;
  customer_email?: string | null;
};

type AdminStat = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  chipClassName: string;
};

const formatMenuPrice = (price: PizzaType["price"]) => {
  const amount = typeof price === "number" ? price : Number(price);

  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "—";
};

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const firstName = user?.name?.split(" ")[0];

  const [customers, vendors, menus, payments] = await Promise.all([
    fetchArray<Account>("/user"),
    fetchArray<Account>("/vendor"),
    fetchArray<PizzaType>("/adminmenu"),
    fetchArray<Payment>("/payment"),
  ]);

  const pendingMenus = menus
    .filter((item) => item.status === "pending")
    .sort((a, b) => orderTimestamp(b._id) - orderTimestamp(a._id));

  const recentPayments = [...payments]
    .sort((a, b) => orderTimestamp(b._id) - orderTimestamp(a._id))
    .slice(0, 4);

  const vendorById = new Map(vendors.map((vendor) => [vendor._id, vendor]));
  const premiumVendorCount = vendors.filter((vendor) => vendor.premium).length;
  const totalAccounts = customers.length + vendors.length;

  const stats: AdminStat[] = [
    {
      label: "Registered users",
      value: String(totalAccounts),
      hint: "Customers + vendors",
      icon: Users,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "Vendors",
      value: String(vendors.length),
      hint: "Storefront accounts",
      icon: Store,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
    {
      label: "Customers",
      value: String(customers.length),
      hint: "User-role accounts",
      icon: User,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Menu items",
      value: String(menus.length),
      hint: "Across all vendors",
      icon: UtensilsCrossed,
      chipClassName: "bg-crust-gold/20 text-charcoal-dark",
    },
    {
      label: "Pending menus",
      value: String(pendingMenus.length),
      hint: "Awaiting approval",
      icon: Clock3,
      chipClassName: "bg-error-container text-on-error-container",
    },
    {
      label: "Transactions",
      value: String(payments.length),
      hint: "Verified payments",
      icon: CreditCard,
      chipClassName: "bg-surface-container-low text-on-surface-variant",
    },
  ];

  return (
    <div className="space-y-space-lg">
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Platform overview
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            {firstName ? `Platform overview, ${firstName}` : "Platform overview"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Live totals across accounts, menus and verified payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            href="/admin/dashboard/menu"
          >
            <UtensilsCrossed size={16} />
            Review menu
          </Link>
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
            href="/admin/dashboard/payment"
          >
            <CreditCard size={16} />
            View payments
          </Link>
        </div>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-space-sm sm:gap-space-md md:grid-cols-3 xl:grid-cols-6">
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
                Pending menu approvals
              </h2>
              <p className="font-label-sm text-label-sm text-outline">
                {pendingMenus.length === 0
                  ? "Approval queue is clear"
                  : `${pendingMenus.length} ${
                      pendingMenus.length === 1 ? "dish" : "dishes"
                    } waiting for a decision`}
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
              href="/admin/dashboard/menu"
            >
              Review menu
              <ArrowRight size={14} />
            </Link>
          </div>

          {pendingMenus.length === 0 ? (
            <div className="flex flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-outline">
                <UtensilsCrossed size={22} />
              </span>
              <p className="font-title-md text-title-md text-charcoal-dark">
                Nothing to approve
              </p>
              <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
                New vendor dishes appear here until they are approved or
                rejected.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-surface-container-high">
              {pendingMenus.slice(0, 5).map((item) => {
                const submittedAt = orderPlacedAt(item._id);

                return (
                  <li key={item._id}>
                    <Link
                      className="flex flex-wrap items-center gap-space-sm px-space-md py-space-md transition-colors hover:bg-surface-container-low"
                      href="/admin/dashboard/menu"
                    >
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                        <Image
                          alt={item.name}
                          className="object-cover"
                          fill
                          sizes="44px"
                          src={item.image || PLACEHOLDER_IMAGE}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                          {item.name}
                        </p>
                        <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                          {item.vendor?.name || "Vendor"}
                          {submittedAt
                            ? ` · ${formatPlacedAt(submittedAt)}`
                            : ""}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                          {formatMenuPrice(item.price)}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-crust-gold/20 px-space-sm py-space-xs font-label-sm text-label-sm font-bold capitalize text-secondary">
                          {item.status}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="space-y-space-md">
          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Recent transactions
              </h2>
              <Link
                className="inline-flex items-center gap-space-xs font-label-sm text-label-sm font-bold text-primary transition-colors hover:text-primary-container"
                href="/admin/dashboard/payment"
              >
                All payments
                <ArrowRight size={13} />
              </Link>
            </div>

            {recentPayments.length === 0 ? (
              <p className="px-space-md py-space-md font-body-md text-body-md text-on-surface-variant">
                No verified payments yet.
              </p>
            ) : (
              <ul className="divide-y divide-surface-container-high">
                {recentPayments.map((payment) => {
                  const vendor = vendorById.get(payment.client_reference_id);
                  const paid =
                    payment.payment_status?.toLowerCase() === "paid";

                  return (
                    <li key={payment._id}>
                      <Link
                        className="flex items-center gap-space-sm px-space-md py-space-sm transition-colors hover:bg-surface-container-low"
                        href="/admin/dashboard/payment"
                      >
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface-container-low">
                          <Image
                            alt=""
                            className="object-cover"
                            fill
                            sizes="36px"
                            src={vendor?.image || PLACEHOLDER_IMAGE}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                            {vendor?.name ||
                              payment.customer_email ||
                              "Unknown vendor"}
                          </p>
                          <p className="truncate font-label-sm text-label-sm text-outline">
                            {payment.payment_status || "unknown"}
                          </p>
                        </div>
                        <span
                          className={`whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${
                            paid
                              ? "bg-tertiary-fixed text-tertiary"
                              : "bg-crust-gold/20 text-secondary"
                          }`}
                        >
                          {paid ? "Paid" : "Pending"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Account mix
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crust-gold/20 text-charcoal-dark">
                <Users size={16} />
              </span>
            </div>

            <p className="mt-space-sm font-headline-md text-headline-md text-charcoal-dark">
              {totalAccounts}{" "}
              {totalAccounts === 1 ? "account" : "accounts"}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {customers.length} customers · {vendors.length} vendors
            </p>

            <div
              aria-hidden="true"
              className="mt-space-md flex h-2 overflow-hidden rounded-full bg-surface-container-high"
            >
              {totalAccounts > 0 ? (
                <>
                  <span
                    className="h-full bg-primary-container"
                    style={{
                      width: `${(customers.length / totalAccounts) * 100}%`,
                    }}
                  />
                  <span
                    className="h-full bg-crust-gold"
                    style={{
                      width: `${(vendors.length / totalAccounts) * 100}%`,
                    }}
                  />
                </>
              ) : null}
            </div>

            <ul className="mt-space-sm space-y-space-xs">
              <li className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="inline-flex items-center gap-2 text-on-surface-variant">
                  <span className="h-2 w-2 rounded-full bg-primary-container" />
                  Customers
                </span>
                <span className="font-bold text-charcoal-dark">
                  {customers.length}
                </span>
              </li>
              <li className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="inline-flex items-center gap-2 text-on-surface-variant">
                  <span className="h-2 w-2 rounded-full bg-crust-gold" />
                  Vendors
                </span>
                <span className="font-bold text-charcoal-dark">
                  {vendors.length}
                </span>
              </li>
            </ul>

            <p className="mt-space-sm flex items-center gap-space-xs border-t border-surface-container-high pt-space-sm font-label-sm text-label-sm text-on-surface-variant">
              <Crown className="shrink-0 text-secondary" size={14} />
              {premiumVendorCount} of {vendors.length} vendors on Premium
            </p>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
