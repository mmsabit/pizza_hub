import {
  BadgeCheck,
  CreditCard,
  Mail,
  ReceiptText,
  Store,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import {
  PLACEHOLDER_IMAGE,
  formatPlacedAt,
  orderTimestamp,
} from "@/app/(dashboard)/user/dashboard/order/_comp/order-ui";

export const metadata: Metadata = {
  title: "Payments — PizzaHub admin",
  description:
    "Every Premium subscription payment verified through Stripe, with the vendor it was billed to.",
};

type PaymentType = {
  _id: string;
  client_reference_id: string;
  sessionId: string;
  status: string;
  payment_status: string;
  customer_email?: string | null;
  payment_intent?: string | null;
};

type VendorType = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

async function getVendor(id: string): Promise<VendorType | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-data/${id}`,
      { cache: "no-store" },
    );

    if (!res.ok) return null;

    return (await res.json()) as VendorType;
  } catch {
    return null;
  }
}

function statusTone(value?: string | null) {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized === "paid" || normalized === "complete") {
    return {
      chip: "bg-tertiary-fixed text-tertiary",
      dot: "bg-tertiary",
    };
  }

  if (
    normalized === "open" ||
    normalized === "processing" ||
    normalized === "unpaid"
  ) {
    return {
      chip: "bg-crust-gold/20 text-secondary",
      dot: "bg-crust-gold",
    };
  }

  return {
    chip: "bg-surface-container-low text-on-surface-variant",
    dot: "bg-outline",
  };
}

function StatusBadge({ value }: { value?: string | null }) {
  const label = value ? value.replace(/[_-]+/g, " ") : "unknown";
  const tone = statusTone(value);

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold capitalize ${tone.chip}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {label}
    </span>
  );
}

export default async function PaymentTransactionPage() {
  let fetchedPayments: PaymentType[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) fetchedPayments = data as PaymentType[];
    }
  } catch {
    fetchedPayments = [];
  }

  const payments = [...fetchedPayments].sort(
    (a, b) => orderTimestamp(b._id) - orderTimestamp(a._id),
  );

  // One vendor lookup per unique account, not per payment.
  const vendorIds = [
    ...new Set(
      payments
        .map((payment) => payment.client_reference_id)
        .filter(Boolean),
    ),
  ];
  const vendorEntries = await Promise.all(
    vendorIds.map(async (id) => [id, await getVendor(id)] as const),
  );
  const vendors = new Map<string, VendorType | null>(vendorEntries);

  const paidCount = payments.filter(
    (payment) => payment.payment_status?.toLowerCase() === "paid",
  ).length;
  const completeCount = payments.filter(
    (payment) => payment.status?.toLowerCase() === "complete",
  ).length;

  const stats = [
    {
      label: "Payments verified",
      value: String(payments.length),
      hint: "Stripe records on file",
      icon: CreditCard,
      chipClassName: "bg-primary-fixed text-primary",
    },
    {
      label: "Paid",
      value: String(paidCount),
      hint: "payment_status = paid",
      icon: BadgeCheck,
      chipClassName: "bg-tertiary-fixed text-tertiary",
    },
    {
      label: "Complete checkouts",
      value: String(completeCount),
      hint: "status = complete",
      icon: ReceiptText,
      chipClassName: "bg-secondary-fixed text-secondary",
    },
    {
      label: "Vendors billed",
      value: String(vendorIds.length),
      hint: "Unique premium accounts",
      icon: Store,
      chipClassName: "bg-crust-gold/20 text-charcoal-dark",
    },
  ];

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-crust-gold" />
            Premium billing
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Payments
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {payments.length === 0
              ? "No Premium payments have been verified yet."
              : `Tracking ${payments.length} verified ${
                  payments.length === 1 ? "payment" : "payments"
                } across ${vendorIds.length} ${
                  vendorIds.length === 1 ? "vendor" : "vendors"
                }.`}
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
              Transaction history
            </h2>
            <p className="font-label-sm text-label-sm text-outline">
              Newest first, derived from each payment record.
            </p>
          </div>
          <span className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
            <Users size={14} />
            {vendorIds.length} billed{" "}
            {vendorIds.length === 1 ? "vendor" : "vendors"}
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-outline">
              <CreditCard size={22} />
            </span>
            <p className="font-title-md text-title-md text-charcoal-dark">
              Nothing to reconcile yet
            </p>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              Premium checkouts show up here after Stripe confirms them and the
              backend stores the payment record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left">
              <thead>
                <tr className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  <th className="px-space-md py-space-sm font-bold">Vendor</th>
                  <th className="px-space-md py-space-sm font-bold">Role</th>
                  <th className="px-space-md py-space-sm font-bold">Checkout</th>
                  <th className="px-space-md py-space-sm font-bold">Payment</th>
                  <th className="px-space-md py-space-sm font-bold">
                    Receipt email
                  </th>
                  <th className="px-space-md py-space-sm font-bold">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {payments.map((payment) => {
                  const vendor = vendors.get(payment.client_reference_id);
                  const recorded = orderTimestamp(payment._id);

                  return (
                    <tr
                      key={payment._id}
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
                              src={vendor?.image || PLACEHOLDER_IMAGE}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                              {vendor?.name || "Unknown vendor"}
                            </p>
                            <p className="truncate font-label-sm text-label-sm text-outline">
                              {vendor?.email || "No email on file"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-space-md py-space-sm">
                        <span className="inline-flex items-center rounded-full bg-primary-fixed px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                          {vendor?.role || "vendor"}
                        </span>
                      </td>

                      <td className="px-space-md py-space-sm">
                        <StatusBadge value={payment.status} />
                      </td>

                      <td className="px-space-md py-space-sm">
                        <StatusBadge value={payment.payment_status} />
                      </td>

                      <td className="px-space-md py-space-sm">
                        <span className="flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface-variant">
                          <Mail className="shrink-0 text-outline" size={14} />
                          <span className="truncate">
                            {payment.customer_email || "—"}
                          </span>
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant">
                        {recorded ? formatPlacedAt(new Date(recorded)) : "—"}
                      </td>

                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
