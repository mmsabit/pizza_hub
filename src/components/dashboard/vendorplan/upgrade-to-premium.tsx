"use client";

import { BadgeCheck, Crown, Loader2, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";

const PREMIUM_PERKS = [
  "Unlimited active menu items",
  "Premium vendor badge on your storefront",
  "Featured menu placement in search",
  "Everything in the Free plan",
];

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export function UpgradeToPremium() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const openDialog = () => {
    setIsRedirecting(false);
    dialogRef.current?.showModal();
  };

  const startCheckout = async () => {
    setIsRedirecting(true);

    try {
      const res = await fetch("/api/checkout_sessions", { method: "POST" });
      const data = (await res.json()) as CheckoutResponse;

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setIsRedirecting(false);
      toast.error(
        error instanceof Error ? error.message : "Could not start checkout.",
        {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        },
      );
    }
  };

  return (
    <>
      <button
        className="mt-space-lg inline-flex w-full items-center justify-center gap-space-xs rounded-xl bg-crust-gold px-space-md py-space-sm font-label-lg text-label-lg font-bold text-charcoal-dark shadow-lg shadow-crust-gold/25 transition-all hover:-translate-y-0.5 hover:bg-secondary-fixed"
        onClick={openDialog}
        type="button"
      >
        <Crown size={16} />
        Upgrade to Premium
      </button>

      <dialog
        aria-labelledby="upgrade-premium-title"
        className="modal"
        ref={dialogRef}
      >
        <div className="modal-box max-w-md">
          <form method="dialog">
            <button
              aria-label="Close dialog"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="submit"
            >
              <X size={16} />
            </button>
          </form>

          <div className="pr-8">
            <span className="inline-flex items-center gap-space-xs rounded-full bg-crust-gold/20 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
              <Sparkles size={12} />
              Premium
            </span>
            <h2
              className="mt-space-sm font-title-md text-title-md text-charcoal-dark"
              id="upgrade-premium-title"
            >
              Upgrade your storefront
            </h2>
            <p className="mt-space-xs font-label-lg text-label-lg font-bold text-primary text-3xl">
              $20/month
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Premium unlocks the full toolkit for growing kitchens. You will be
              redirected to Stripe to complete the subscription securely.
            </p>
          </div>

          <ul className="mt-space-md space-y-space-sm">
            {PREMIUM_PERKS.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-space-sm font-body-md text-body-md text-on-surface-variant"
              >
                <BadgeCheck
                  className="mt-0.5 shrink-0 text-tertiary"
                  size={18}
                />
                {perk}
              </li>
            ))}
          </ul>

          <div className="modal-action">
            <button
              className="btn btn-ghost"
              disabled={isRedirecting}
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              Not now
            </button>
            <button
              className="btn btn-primary"
              disabled={isRedirecting}
              onClick={startCheckout}
              type="button"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Redirecting…
                </>
              ) : (
                <>
                  <Crown size={16} />
                  Continue to checkout
                </>
              )}
            </button>
          </div>

          <p className="mt-space-sm text-center font-label-sm text-label-sm text-outline">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </div>

        <form className="modal-backdrop" method="dialog">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
