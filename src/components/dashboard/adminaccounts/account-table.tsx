import {  Crown, Store } from "lucide-react";
import Image from "next/image";

import { PLACEHOLDER_IMAGE } from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";

export type AdminAccount = {
  _id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  image?: string | null;
  role?: string | null;
  premium?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

/** Milliseconds for an account's creation time, or 0 when it is missing. */
export function accountCreatedTime(account: AdminAccount) {
  if (!account.createdAt) return 0;

  const time = new Date(account.createdAt).getTime();

  return Number.isFinite(time) ? time : 0;
}

export function formatJoinedDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

type AccountTableProps = {
  accounts: AdminAccount[];
  variant: "user" | "vendor";
};

export function AccountTable({ accounts, variant }: AccountTableProps) {
  const showPlan = variant === "vendor";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-200 text-left">
        <thead>
          <tr className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            <th className="px-space-md py-space-sm font-bold">Account</th>
            <th className="px-space-md py-space-sm font-bold">Email</th>
            {showPlan ? (
              <th className="px-space-md py-space-sm font-bold">Plan</th>
            ) : null}
            <th className="px-space-md py-space-sm font-bold">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-high">
          {accounts.map((account) => (
            <tr
              key={account._id}
              className="align-middle hover:bg-surface-container-low"
            >
              <td className="px-space-md py-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-container-low">
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="40px"
                      src={account.image || PLACEHOLDER_IMAGE}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                      {account.name || "Unnamed account"}
                    </p>
                    <p className="truncate font-label-sm text-label-sm text-outline">
                      {account.role === "vendor" ? "Vendor store" : "Customer"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-space-md py-space-sm">
                <p className="max-w-56 truncate font-label-lg text-label-lg text-charcoal-dark">
                  {account.email || "No email on file"}
                </p>
                
              </td>

              {showPlan ? (
                <td className="px-space-md py-space-sm">
                  {account.premium ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-crust-gold/20 px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-secondary">
                      <Crown size={12} />
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-on-surface-variant">
                      <Store size={12} />
                      Free
                    </span>
                  )}
                </td>
              ) : null}

              <td className="whitespace-nowrap px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant">
                {formatJoinedDate(account.createdAt)}
              </td>

              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
