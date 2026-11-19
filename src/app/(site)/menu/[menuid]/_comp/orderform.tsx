"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { Bounce, toast } from "react-toastify";
import {
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";
import type { PizzaType } from "@/app/type/type";

const FIELD_CLASS =
  "w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm text-body-md text-on-surface placeholder:text-outline transition-shadow focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container";
const LABEL_CLASS =
  "block font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant";
const PAYMENT_CARD_CLASS =
  "flex cursor-pointer items-center gap-space-xs rounded-xl border border-outline-variant/60 bg-surface-container-low px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors has-checked:border-primary-container has-checked:bg-primary-fixed/40 has-checked:text-charcoal-dark";
const PLACEHOLDER = "/images/placeholder.png";
const MAX_QUANTITY = 20;
const ORDER_MODAL_ID = "orderModal";

const formatPrice = (value: number) =>
  `৳${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const closeOrderForm = () => {
  (document.getElementById(ORDER_MODAL_ID) as HTMLDialogElement)?.close();
};

type usertype = {
  id: string;
  name: string;
};

const OrderForm = ({ menu, user }: { menu: PizzaType; user: usertype }) => {
  const uid = useId();
  const [quantity, setQuantity] = useState(1);

  const unitPrice = Number(menu.price);
  const hasPrice = Number.isFinite(unitPrice);
  const subtotal = hasPrice ? unitPrice * quantity : 0;

  const openDialog = () => {
    if (!menu.available || !hasPrice) return;
    setQuantity(1);
    (document.getElementById(ORDER_MODAL_ID) as HTMLDialogElement)?.showModal();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!menu.available) {
      toast.error(`${menu.name} is not available right now.`, {
        position: "bottom-right",
        autoClose: 4000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const order = {
      menuId: menu._id,
      menuName: menu.name,
      vendor: {
        id: menu.vendor?.id ?? "",
        name: menu.vendor?.name ?? "",
      },
      quantity,
      unitPrice,
      subtotal,
      payment: String(formData.get("payment") ?? "cash"),
      customer: {
        name: String(formData.get("customerName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        note: String(formData.get("note") ?? "").trim(),
      },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      toast.success(
        `${quantity} × ${menu.name} added to your order request. We'll confirm by phone shortly.`,
        {
          position: "bottom-right",
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        },
      );

      form.reset();
      setQuantity(1);
      closeOrderForm();
    }
  };

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary-container"
        disabled={!menu.available || !hasPrice}
        onClick={openDialog}
        type="button"
      >
        <ShoppingBag size={16} />
        {menu.available ? "Order now" : "Unavailable"}
      </button>

      <dialog
        aria-labelledby={`${uid}-title`}
        className="modal"
        id={ORDER_MODAL_ID}
      >
        <div className="modal-box max-w-lg">
          <form method="dialog">
            <button
              aria-label="Close order form"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="submit"
            >
              <X size={16} />
            </button>
          </form>

          <div className="flex items-start gap-space-md pr-8">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-container-low">
              <Image
                alt={menu.name}
                className="object-cover"
                fill
                sizes="64px"
                src={menu.image || PLACEHOLDER}
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="block font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary">
                Place your order
              </span>
              <h2
                className="truncate font-headline-sm text-headline-sm font-bold text-charcoal-dark"
                id={`${uid}-title`}
              >
                {menu.name}
              </h2>
              <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                From {menu.vendor?.name ?? "PizzaHub kitchen"}
              </p>
            </div>
          </div>

          <form
            className="mt-space-md space-y-space-md"
            onSubmit={handleSubmit}
          >
            {/* Quantity */}
            <div className="flex flex-wrap items-end justify-between gap-space-md rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md">
              <div>
                <span className={LABEL_CLASS}>Quantity</span>
                <div className="mt-space-xs flex items-center gap-space-sm">
                  <button
                    aria-label="Decrease quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/60 text-charcoal-dark transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    type="button"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    aria-label="Quantity"
                    className="h-9 w-16 rounded-xl border border-outline-variant/60 bg-dough-canvas text-center font-label-lg text-label-lg font-bold text-charcoal-dark focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container"
                    id={`${uid}-quantity`}
                    max={MAX_QUANTITY}
                    min={1}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setQuantity(
                        Number.isFinite(next)
                          ? Math.min(
                              MAX_QUANTITY,
                              Math.max(1, Math.floor(next)),
                            )
                          : 1,
                      );
                    }}
                    type="number"
                    value={quantity}
                  />

                  <button
                    aria-label="Increase quantity"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/60 text-charcoal-dark transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={quantity >= MAX_QUANTITY}
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(MAX_QUANTITY, current + 1),
                      )
                    }
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className={LABEL_CLASS}>Unit price</span>
                <p className="mt-space-xs font-headline-sm text-headline-sm font-bold text-primary">
                  {hasPrice ? formatPrice(unitPrice) : "—"}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="grid gap-space-md sm:grid-cols-2">
              <div className="space-y-space-xs">
                <label className={LABEL_CLASS} htmlFor={`${uid}-name`}>
                  Full name
                </label>
                <input
                  autoComplete="name"
                  className={FIELD_CLASS}
                  id={`${uid}-name`}
                  name="customerName"
                  placeholder="Ayesha Rahman"
                  required
                  type="text"
                  defaultValue={user.name}
                />
              </div>

              <div className="space-y-space-xs">
                <label className={LABEL_CLASS} htmlFor={`${uid}-phone`}>
                  Phone
                </label>
                <input
                  autoComplete="tel"
                  className={FIELD_CLASS}
                  id={`${uid}-phone`}
                  inputMode="tel"
                  name="phone"
                  pattern="[0-9+\-\s]{6,20}"
                  placeholder="+880 1XXX XXXXXX"
                  required
                  type="tel"
                />
              </div>
            </div>

            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`${uid}-address`}>
                Delivery address
              </label>
              <textarea
                autoComplete="street-address"
                className={FIELD_CLASS}
                id={`${uid}-address`}
                name="address"
                placeholder="House, road, area and a landmark for the rider."
                required
                rows={2}
              />
            </div>

            <div className="space-y-space-xs">
              <label className={LABEL_CLASS} htmlFor={`${uid}-note`}>
                Delivery note{" "}
                <span className="font-normal normal-case text-outline">
                  (optional)
                </span>
              </label>
              <input
                className={FIELD_CLASS}
                id={`${uid}-note`}
                name="note"
                placeholder="Extra napkins, ring the bell twice..."
                type="text"
              />
            </div>

            {/* Payment */}
            <fieldset className="space-y-space-xs">
              <legend className={`${LABEL_CLASS} mb-space-xs`}>
                Payment method
              </legend>
              <div className="grid grid-cols-2 gap-space-sm">
                <label className={PAYMENT_CARD_CLASS}>
                  <input
                    className="h-4 w-4 shrink-0 accent-primary-container"
                    defaultChecked
                    name="payment"
                    type="radio"
                    value="cash"
                  />
                  <Wallet size={16} />
                  Cash on delivery
                </label>

                <label className={PAYMENT_CARD_CLASS}>
                  <input
                    className="h-4 w-4 shrink-0 accent-primary-container"
                    name="payment"
                    type="radio"
                    value="card"
                  />
                  <CreditCard size={16} />
                  Card on delivery
                </label>
              </div>
            </fieldset>

            {/* Summary */}
            <div className="space-y-space-xs rounded-2xl bg-surface-container-low p-space-md">
              <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                <span>
                  {quantity} × {menu.name}
                </span>
                <span>{hasPrice ? formatPrice(unitPrice) : "—"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-surface-container-high pt-space-sm">
                <span className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                  Subtotal
                </span>
                <span className="font-headline-sm text-headline-sm font-bold text-primary">
                  {hasPrice ? formatPrice(subtotal) : "—"}
                </span>
              </div>
              <p className="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
                <MapPin size={12} />
                Delivery fee is confirmed by the kitchen when they call you.
              </p>
            </div>
            <input name="Orderstatus" type="hidden" value={"PENDING"} />
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={closeOrderForm}
                type="button"
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                <ShoppingBag size={16} />
                Place order · {hasPrice ? formatPrice(subtotal) : "—"}
              </button>
            </div>
          </form>
        </div>

        <form className="modal-backdrop" method="dialog">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default OrderForm;
