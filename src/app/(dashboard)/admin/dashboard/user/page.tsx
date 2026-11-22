import { BadgeCheck, CalendarPlus, MailWarning, Users } from "lucide-react";
import type { Metadata } from "next";

import {
  AccountTable,
  accountCreatedTime,
  type AdminAccount,
} from "@/components/dashboard/adminaccounts/account-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Users — PizzaHub admin",
  description:
    "Every customer account on PizzaHub, with its verification state and join date.",
};

const DAY = 24 * 60 * 60 * 1000;

const joinedWithin = (account: AdminAccount, days: number) => {
  const created = accountCreatedTime(account);

  return created > 0 && Date.now() - created <= days * DAY;
};

export default async function UserListPage() {
  let fetchedUsers: AdminAccount[] = [];
  const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken.token

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      cache: "no-store",
      headers:{
        authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) fetchedUsers = data as AdminAccount[];
    }
  } catch {
    fetchedUsers = [];
  }

  const users = [...fetchedUsers].sort(
    (a, b) => accountCreatedTime(b) - accountCreatedTime(a),
  );

  const verifiedCount = users.filter((user) => user.emailVerified).length;
  const newCount = users.filter((user) => joinedWithin(user, 30)).length;

  const stats = [
    {
      label: "Customers",
      value: String(users.length),
      hint: "Accounts with the user role",
      icon: Users,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "Email verified",
      value: String(verifiedCount),
      hint: "Ready for password recovery",
      icon: BadgeCheck,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Unverified",
      value: String(users.length - verifiedCount),
      hint: "Email not confirmed yet",
      icon: MailWarning,
      chipClassName: "bg-crust-gold/20 text-secondary",
    },
    {
      label: "New this month",
      value: String(newCount),
      hint: "Joined in the last 30 days",
      icon: CalendarPlus,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
  ];

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Platform accounts
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Users
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {users.length === 0
              ? "No customer accounts have been created yet."
              : `Watching ${users.length} ${
                  users.length === 1 ? "customer account" : "customer accounts"
                } across the storefront.`}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-space-sm sm:gap-space-md xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm"
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
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
          <div>
            <h2 className="font-title-md text-title-md text-charcoal-dark">
              Customer directory
            </h2>
            <p className="font-label-sm text-label-sm text-outline">
              Newest accounts first.
            </p>
          </div>
          <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <Users size={14} />
            {verifiedCount} of {users.length} verified
          </span>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-outline">
              <Users size={22} />
            </span>
            <p className="font-title-md text-title-md text-charcoal-dark">
              No customers yet
            </p>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              Accounts created through the storefront sign-up form show up here.
            </p>
          </div>
        ) : (
          <AccountTable accounts={users} variant="user" />
        )}
      </section>
    </div>
  );
}
