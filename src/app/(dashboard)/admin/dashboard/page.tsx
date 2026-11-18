import {
  ArrowRight,
  Banknote,
  ReceiptText,
  ShieldAlert,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin dashboard — PizzaHub",
  description:
    "Platform-wide view of vendors, customers, orders and reports across PizzaHub.",
};

const STATS = [
  {
    label: "Active vendors",
    value: "128",
    hint: "+6 this week",
    icon: Store,
    chipClassName: "bg-secondary-fixed text-secondary",
  },
  {
    label: "Total users",
    value: "12,480",
    hint: "+214 this week",
    icon: Users,
    chipClassName: "bg-primary-fixed text-primary",
  },
  {
    label: "Orders today",
    value: "1,932",
    hint: "+9% vs yesterday",
    icon: ReceiptText,
    chipClassName: "bg-tertiary-fixed text-tertiary",
  },
  {
    label: "Open reports",
    value: "7",
    hint: "3 high priority",
    icon: ShieldAlert,
    chipClassName: "bg-error-container text-on-error-container",
  },
];

const APPLICATIONS = [
  {
    name: "Nonna's Slice House",
    city: "Queens, NY",
    submitted: "Submitted 2 hours ago",
    status: "New",
    statusClassName: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    name: "Ember & Crust",
    city: "Jersey City, NJ",
    submitted: "Submitted yesterday",
    status: "Documents needed",
    statusClassName: "bg-secondary-fixed text-on-secondary-fixed-variant",
  },
  {
    name: "Basil & Barrel",
    city: "Brooklyn, NY",
    submitted: "Submitted 2 days ago",
    status: "Site visit booked",
    statusClassName: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
];

const SIGNUPS = [
  { name: "Maya Chen", detail: "maya@embercrust.co", role: "Vendor", roleClassName: "bg-primary-fixed text-primary" },
  { name: "Luca Romano", detail: "luca@example.com", role: "User", roleClassName: "bg-surface-container-low text-on-surface-variant" },
  { name: "Priya Nair", detail: "priya@basilbarrel.co", role: "Vendor", roleClassName: "bg-primary-fixed text-primary" },
  { name: "Tom Becker", detail: "tom@example.com", role: "User", roleClassName: "bg-surface-container-low text-on-surface-variant" },
];

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
            Platform · Tuesday, 17 November
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            {firstName ? `Platform overview, ${firstName}` : "Platform overview"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Everything happening across PizzaHub in the last 24 hours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            href="#vendor-applications"
          >
            <Store size={16} />
            Review vendors
          </Link>
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
            href="#"
          >
            <Banknote size={16} />
            Export report
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
          className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm xl:col-span-2"
          id="vendor-applications"
        >
          <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
            <div>
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Vendor applications
              </h2>
              <p className="font-label-sm text-label-sm text-outline">
                3 waiting for a decision
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
            {APPLICATIONS.map((application) => (
              <li
                key={application.name}
                className="flex flex-wrap items-center gap-space-sm px-space-md py-space-md transition-colors hover:bg-surface-container-low"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-secondary">
                  <Store size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                    {application.name}
                  </p>
                  <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                    {application.city} · {application.submitted}
                  </p>
                </div>

                <div className="flex w-full items-center justify-between gap-space-sm pl-14 sm:w-auto sm:justify-end sm:gap-space-md sm:pl-0">
                  <span
                    className={`whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${application.statusClassName}`}
                  >
                    {application.status}
                  </span>
                  <Link
                    className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                    href="#"
                  >
                    Review
                    <ArrowRight size={13} />
                  </Link>
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
                Platform health
              </span>
              <ShieldAlert className="text-secondary-container" size={22} />
            </div>

            <p className="mt-space-sm font-headline-sm text-headline-sm">
              94% on-time
            </p>
            <p className="font-label-sm text-label-sm text-surface-container-high/70">
              Across 1,932 deliveries today.
            </p>

            <div className="mt-space-md">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-surface-container-high/70">
                <span>On-time window</span>
                <span>Target 90%</span>
              </div>
              <div className="mt-space-xs h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest/15">
                <div className="h-full w-[94%] rounded-full bg-basil-fresh" />
              </div>
            </div>

            <dl className="mt-space-md grid grid-cols-2 gap-space-sm border-t border-surface-container-lowest/10 pt-space-sm">
              <div>
                <dt className="font-label-sm text-label-sm text-surface-container-high/70">
                  Avg. delivery
                </dt>
                <dd className="font-label-lg text-label-lg font-bold">26 min</dd>
              </div>
              <div>
                <dt className="font-label-sm text-label-sm text-surface-container-high/70">
                  Refund rate
                </dt>
                <dd className="font-label-lg text-label-lg font-bold">1.2%</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                New signups
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crust-gold/20 text-charcoal-dark">
                <Users size={16} />
              </span>
            </div>

            <ul className="mt-space-sm space-y-space-sm">
              {SIGNUPS.map((person) => (
                <li key={person.name} className="flex items-center gap-space-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low font-label-lg text-label-lg font-bold text-on-surface-variant">
                    {person.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                      {person.name}
                    </p>
                    <p className="truncate font-label-sm text-label-sm text-outline">
                      {person.detail}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${person.roleClassName}`}
                  >
                    {person.role}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
