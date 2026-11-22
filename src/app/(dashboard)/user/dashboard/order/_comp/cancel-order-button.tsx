"use client";

import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { OrderType } from "@/app/type/type";
import { authClient } from "@/lib/auth-client";

type CancelOrderButtonProps = {
  order: Pick<OrderType, "_id" | "order_status">;
  compact?: boolean;
};

export function CancelOrderButton({
  order,
  compact = false,
}: CancelOrderButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (order.order_status !== "PENDING") return null;

  const sizeClassName = compact
    ? "px-space-sm py-1.5 font-label-sm text-label-sm"
    : "px-space-md py-space-sm font-label-lg text-label-lg";

  const cancelOrder = async () => {
    setPending(true);
    setError(null);
const {data} = await authClient.token();
      const token = data?.token;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${order._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json",authorization: `Bearer ${token}` },
          body: JSON.stringify({ order_status: "CANCELLED" }),
        },
      );

      if (!res.ok) throw new Error(`Cancel failed (${res.status})`);

      setConfirming(false);
      router.refresh();
    } catch {
      setError("Could not cancel — please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {confirming ? (
        <div className="flex items-center gap-1">
          <button
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-outline-variant/70 px-space-sm py-1.5 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-charcoal-dark hover:text-charcoal-dark disabled:opacity-60"
            disabled={pending}
            onClick={() => {
              setError(null);
              setConfirming(false);
            }}
            type="button"
          >
            Keep
          </button>
          <button
            aria-busy={pending}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-error px-space-sm py-1.5 font-label-sm text-label-sm text-on-error transition-colors hover:bg-on-error-container disabled:cursor-not-allowed disabled:opacity-70"
            disabled={pending}
            onClick={cancelOrder}
            type="button"
          >
            {pending ? (
              <Loader2 className="animate-spin" size={13} />
            ) : (
              <X size={13} />
            )}
            {pending ? "Cancelling" : "Yes, cancel"}
          </button>
        </div>
      ) : (
        <button
          className={`inline-flex items-center justify-center gap-1 rounded-xl border border-outline-variant/70 text-on-surface-variant transition-colors hover:border-error hover:text-error ${sizeClassName}`}
          onClick={() => setConfirming(true)}
          type="button"
        >
          <X size={14} />
          Cancel order
        </button>
      )}

      {error ? (
        <p
          className="max-w-56 font-label-sm text-label-sm text-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
