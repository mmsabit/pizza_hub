import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Loader2,
  ReceiptText,
  TriangleAlert,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type Stripe from "stripe";

import { auth } from "@/lib/auth";
import { checkoutVerify } from "@/lib/menu";
import { activatePremium } from "@/lib/plan";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Premium checkout — PizzaHub",
  description: "Confirm your PizzaHub Premium subscription payment.",
};

function formatAmount(amount: number | null, currency: string | null) {
  if (amount === null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "usd").toUpperCase(),
  }).format(amount / 100);
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const requestHeaders = await headers();
  const authSession = await auth.api.getSession({ headers: requestHeaders });

  if (!authSession?.user) {
    redirect("/sign-in?redirect=/vendor/dashboard/invoice/success");
  }

  let session: Stripe.Checkout.Session | null = null;
  let error: string | null = null;

  if (!sessionId) {
    error = "This page needs a Stripe checkout session id.";
  } else {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      error = "We could not find that checkout session. It may have expired.";
    }

    if (session) {
      try {
        const jwtToken = await auth.api.getToken({ headers: requestHeaders });
        const result = await checkoutVerify(sessionId, jwtToken.token);
        console.log({ result });
      } catch (verifyError) {
        // A failing backend check should not hide a confirmed Stripe payment.
        console.error("Checkout verification failed:", verifyError);
      }
    }
  }

  const paid =
    session?.payment_status === "paid" ||
    session?.payment_status === "no_payment_required";
  const complete = session?.status === "complete" && paid;
  const pending = Boolean(session) && !complete;

  // Stripe confirms the payment, then this visit flips the vendor to Premium.
  // The checkout session carries the signed-in user's id, so a session id
  // copied from another account cannot grant Premium here.
  if (
    complete &&
    session?.client_reference_id &&
    authSession?.user?.id === session.client_reference_id
  ) {
    try {
      await activatePremium(authSession.user.id);
    } catch (activateError) {
      console.error("Failed to activate Premium:", activateError);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-space-md py-space-xl text-center">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-3xl ${
          complete
            ? "bg-tertiary-fixed text-tertiary"
            : pending
              ? "bg-crust-gold/20 text-secondary"
              : "bg-error-container text-error"
        }`}
      >
        {complete ? (
          <BadgeCheck size={32} />
        ) : pending ? (
          <Loader2 className="animate-spin" size={30} />
        ) : (
          <TriangleAlert size={30} />
        )}
      </span>

      <div>
        <p className="flex items-center justify-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
          <Crown size={12} />
          Premium
        </p>
        <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
          {complete
            ? "You're on Premium"
            : pending
              ? "Payment is processing"
              : "Checkout not found"}
        </h1>
        <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
          {complete
            ? "Your subscription is confirmed. Unlimited menu items, the Premium badge and featured placement are now part of your storefront."
            : pending
              ? "Stripe has not finished confirming this payment yet. Refresh in a moment, or check your Stripe receipt."
              : error}
        </p>
      </div>

      {session ? (
        <dl className="w-full divide-y divide-surface-container-high rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md text-left font-label-lg text-label-lg shadow-sm">
          <div className="flex items-center justify-between gap-space-sm pb-space-sm">
            <dt className="flex items-center gap-1.5 text-on-surface-variant">
              <ReceiptText size={14} />
              Plan
            </dt>
            <dd className="font-bold text-charcoal-dark">Premium</dd>
          </div>
          <div className="flex items-center justify-between gap-space-sm py-space-sm">
            <dt className="text-on-surface-variant">Amount</dt>
            <dd className="font-bold text-charcoal-dark">
              {formatAmount(session.amount_total, session.currency)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-space-sm py-space-sm">
            <dt className="text-on-surface-variant">Status</dt>
            <dd
              className={`font-bold ${
                complete ? "text-tertiary" : "text-secondary"
              }`}
            >
              {complete ? "Paid" : (session.payment_status ?? "Unknown")}
            </dd>
          </div>
          {session.customer_details?.email ? (
            <div className="flex items-center justify-between gap-space-sm pt-space-sm">
              <dt className="text-on-surface-variant">Receipt email</dt>
              <dd className="truncate font-bold text-charcoal-dark">
                {session.customer_details.email}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-space-sm">
        <Link
          className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
          href="/vendor/dashboard/plan"
        >
          Back to plan
          <ArrowRight size={14} />
        </Link>
        <Link
          className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          href="/vendor/dashboard"
        >
          Vendor dashboard
        </Link>
      </div>

      <p className="font-label-sm text-label-sm text-outline">
        Keep the Stripe receipt email for your records.
      </p>
    </div>
  );
}
