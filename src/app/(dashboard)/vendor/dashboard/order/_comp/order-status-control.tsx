"use client";

import { ArrowRight, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { OrderStateType } from "@/app/type/type";

const NEXT_STEP: Partial<
  Record<OrderStateType, { status: OrderStateType; label: string }>
> = {
  PENDING: { status: "CONFIRMED", label: "Accept order" },
  CONFIRMED: { status: "PREPARING", label: "Start preparing" },
  PREPARING: { status: "READY", label: "Mark as ready" },
  READY: { status: "OUT_FOR_DELIVERY", label: "Hand to rider" },
  OUT_FOR_DELIVERY: { status: "DELIVERED", label: "Mark delivered" },
};

type OrderStatusControlProps = {
  orderId: string;
  status: OrderStateType;
};

export function OrderStatusControl({
  orderId,
  status,
}: OrderStatusControlProps) {
  const router = useRouter();
  const [pending, setPending] = useState<OrderStateType | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = NEXT_STEP[status];
  const isClosed = status === "DELIVERED" || status === "CANCELLED";

  async function updateStatus(target: OrderStateType) {
    setPending(target);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_status: target }),
        },
      );

      if (!res.ok) throw new Error(`Status update failed (${res.status})`);

      setConfirmingCancel(false);
      router.refresh();
    } catch {
      setError("Could not update the order — please try again.");
    } finally {
      setPending(null);
    }
  }

  if (isClosed) {
    return (
      <p className="mt-space-sm rounded-xl bg-surface-container-low px-space-md py-space-sm font-label-sm text-label-sm text-on-surface-variant">
        {status === "DELIVERED"
          ? "This ticket is closed — delivered and settled."
          : "This ticket was cancelled. No further status changes."}
      </p>
    );
  }

  return (
    <div className="mt-space-sm flex flex-col gap-space-sm">
      {nextStep ? (
        <button
          aria-busy={pending === nextStep.status}
          className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          disabled={pending !== null}
          onClick={() => updateStatus(nextStep.status)}
          type="button"
        >
          {pending === nextStep.status ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
          {nextStep.label}
        </button>
      ) : null}

      {confirmingCancel ? (
        <div className="flex items-center gap-space-xs">
          <button
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-outline-variant/70 px-space-sm py-space-sm font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-charcoal-dark hover:text-charcoal-dark disabled:opacity-60"
            disabled={pending !== null}
            onClick={() => {
              setError(null);
              setConfirmingCancel(false);
            }}
            type="button"
          >
            Keep ticket
          </button>
          <button
            aria-busy={pending === "CANCELLED"}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-error px-space-sm py-space-sm font-label-sm text-label-sm text-on-error transition-colors hover:bg-on-error-container disabled:cursor-not-allowed disabled:opacity-70"
            disabled={pending !== null}
            onClick={() => updateStatus("CANCELLED")}
            type="button"
          >
            {pending === "CANCELLED" ? (
              <Loader2 className="animate-spin" size={13} />
            ) : (
              <X size={13} />
            )}
            Yes, cancel
          </button>
        </div>
      ) : (
        <button
          className="inline-flex items-center justify-center gap-space-xs rounded-xl border border-outline-variant/70 px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-error hover:text-error disabled:opacity-60"
          disabled={pending !== null}
          onClick={() => setConfirmingCancel(true)}
          type="button"
        >
          <X size={14} />
          Cancel order
        </button>
      )}

      {error ? (
        <p className="font-label-sm text-label-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
