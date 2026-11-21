"use client";

import { BadgeCheck, Crown, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { Bounce, toast } from "react-toastify";

const PREMIUM_PERKS = [
  "Unlimited active menu items",
  "Premium vendor badge on your storefront",
  "Featured menu placement in search",
  "Everything in the Free plan",
];

export function UpgradeToPremium() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [requested, setRequested] = useState(false);

  const openDialog = () => {
    setRequested(false);
    dialogRef.current?.showModal();
  };

  const sendRequest = () => {
    setRequested(true);
    toast.success("Upgrade request sent — our team will reach out.", {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
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

          {requested ? (
            <div className="flex flex-col items-center gap-space-sm py-space-md text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary-fixed text-tertiary">
                <BadgeCheck size={28} />
              </span>
              <h2
                className="font-title-md text-title-md text-charcoal-dark"
                id="upgrade-premium-title"
              >
                Request received
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The PizzaHub team will confirm your Premium activation and
                billing details by email. Your Free plan stays active until
                then.
              </p>
              <form className="modal-action" method="dialog">
                <button className="btn btn-primary" type="submit">
                  Got it
                </button>
              </form>
            </div>
          ) : (
            <>
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
                  Premium unlocks the full toolkit for growing kitchens. This
                  sends an upgrade request to the PizzaHub team.
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
                  onClick={() => dialogRef.current?.close()}
                  type="button"
                >
                  Not now
                </button>
                <button
                  className="btn btn-primary"
                  onClick={sendRequest}
                  type="button"
                >
                  <Crown size={16} />
                  Send upgrade request
                </button>
              </div>
            </>
          )}
        </div>

        <form className="modal-backdrop" method="dialog">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
