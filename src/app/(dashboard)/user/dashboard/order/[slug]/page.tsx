import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  CreditCard,
  MapPin,
  Phone,
  Pizza,
  Plus,
  ReceiptText,
  Store,
  Wallet,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import type { OrderType } from "@/app/type/type";
import { auth } from "@/lib/auth";
import { CancelOrderButton } from "../_comp/cancel-order-button";
import {
  PLACEHOLDER_IMAGE,
  STATUS_STEPS,
  formatPlacedAt,
  formatPrice,
  orderPlacedAt,
  paymentLabel,
  statusMeta,
  statusStepIndex,
} from "../_comp/order-ui";

export const metadata: Metadata = {
  title: "Order details — PizzaHub",
  description: "Track a single wood-fired order from oven to doorstep.",
};

const labelClassName =
  "font-label-sm text-label-sm font-bold uppercase tracking-wider text-outline";

const UserOrderDetailesPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/sign-in");

  if (!/^[\da-f]{24}$/i.test(slug)) notFound();
const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken.token

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/order/${slug}`,
    { cache: "no-store",
      headers:{
        authorization: `Bearer ${token}`
      } },
  );
  if (!response.ok) notFound();

  const order = (await response
    .json()
    .catch(() => null)) as OrderType | null;
  if (!order || order.customer?.id !== session.user.id) notFound();

  const status = statusMeta(order.order_status);
  const placedAt = orderPlacedAt(order._id);
  const stepIndex = statusStepIndex(order.order_status);
  const isCancelled = order.order_status === "CANCELLED";
  const isDelivered = order.order_status === "DELIVERED";

  const quantity = Number(order.quantity) || 0;
  const unitPrice = Number(order.unitPrice) || 0;
  const subtotal = Number(order.subtotal) || 0;

  const customer = order.customer;
  const vendorImage = order.vendor?.image || PLACEHOLDER_IMAGE;
  const isCardPayment = order.payment?.toLowerCase().includes("card");
  const PaymentIcon = isCardPayment ? CreditCard : Wallet;

  return (
    <div className="mx-auto max-w-5xl space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <Link
          className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-primary"
          href="/user/dashboard/order"
        >
          <ArrowLeft size={16} />
          Back to orders
        </Link>
        
      </div>

      <header className="overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
        <div className="flex flex-col gap-space-md p-space-md sm:flex-row sm:items-center sm:p-space-lg">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-container-low sm:h-28 sm:w-28">
            <Image
              alt={order.menuName}
              className="object-cover"
              fill
              priority
              sizes="112px"
              src={order.menuImage || PLACEHOLDER_IMAGE}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${status.chipClassName}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                />
                {status.label}
              </span>
              {isDelivered ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-tertiary">
                  <Check size={12} />
                  Completed
                </span>
              ) : null}
            </div>

            <h1 className="mt-space-xs font-headline-md text-headline-md font-bold text-charcoal-dark">
              {order.menuName}
            </h1>

            <div className="mt-space-xs flex flex-wrap items-center gap-x-space-md gap-y-1 font-label-sm text-label-sm text-outline">
              <span className="inline-flex items-center gap-1">
                <Store size={12} />
                {order.vendor?.name || "Vendor unavailable"}
              </span>
              {placedAt ? (
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} />
                  Placed {formatPlacedAt(placedAt)}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <PaymentIcon size={12} />
                {paymentLabel(order.payment)}
              </span>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-surface-container-low px-space-md py-space-sm sm:text-right">
            <p className={labelClassName}>Order total</p>
            <p className="mt-1 font-headline-md text-headline-md font-bold text-primary">
              {formatPrice(subtotal)}
            </p>
            <p className="font-label-sm text-label-sm text-outline">
              {quantity} × {formatPrice(unitPrice)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-space-md lg:grid-cols-3">
        <div className="space-y-space-md lg:col-span-2">
          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div>
                <h2 className="font-title-md text-title-md text-charcoal-dark">
                  Order progress
                </h2>
                <p className="font-label-sm text-label-sm text-outline">
                  {status.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${status.chipClassName}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`}
                />
                {status.label}
              </span>
            </div>

            {isCancelled ? (
              <div className="mt-space-md flex items-start gap-space-sm rounded-2xl bg-error-container p-space-md">
                <XCircle className="shrink-0 text-error" size={20} />
                <div>
                  <p className="font-label-lg text-label-lg font-bold text-on-error-container">
                    This order was cancelled
                  </p>
                  <p className="font-label-sm text-label-sm text-on-error-container/80">
                    Nothing was charged. Start a fresh order whenever the
                    craving hits.
                  </p>
                </div>
              </div>
            ) : (
              <ol className="mt-space-md">
                {STATUS_STEPS.map((step, index) => {
                  const done = isDelivered || index < stepIndex;
                  const current = !isDelivered && index === stepIndex;

                  return (
                    <li
                      key={step.status}
                      aria-current={current ? "step" : undefined}
                      className="relative flex gap-space-sm pb-space-md last:pb-0"
                    >
                      {index < STATUS_STEPS.length - 1 ? (
                        <span
                          aria-hidden
                          className={`absolute left-3 top-6 h-[calc(100%-1.5rem)] w-px ${
                            done ? "bg-tertiary" : "bg-surface-container-high"
                          }`}
                        />
                      ) : null}

                      <span
                        className={
                          done
                            ? "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary text-on-tertiary"
                            : current
                              ? "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container ring-4 ring-primary-fixed"
                              : "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-outline"
                        }
                      >
                        {done ? (
                          <Check size={12} strokeWidth={3} />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-space-xs">
                          <p
                            className={
                              current
                                ? "font-label-lg text-label-lg font-bold text-charcoal-dark"
                                : done
                                  ? "font-label-lg text-label-lg font-semibold text-charcoal-dark"
                                  : "font-label-lg text-label-lg text-outline"
                            }
                          >
                            {step.label}
                          </p>
                          {current ? (
                            <span className="rounded-full bg-primary-fixed px-space-sm py-0.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                              Now
                            </span>
                          ) : null}
                        </div>
                        <p className="font-label-sm text-label-sm text-outline">
                          {step.hint}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
            <div className="flex items-center justify-between gap-space-sm border-b border-surface-container-high px-space-md py-space-sm">
              <h2 className="font-title-md text-title-md text-charcoal-dark">
                Order summary
              </h2>
              <span className="font-label-sm text-label-sm text-outline">
                {quantity} {quantity === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="p-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                  <Image
                    alt={order.menuName}
                    className="object-cover"
                    fill
                    sizes="56px"
                    src={order.menuImage || PLACEHOLDER_IMAGE}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                    {order.menuName}
                  </p>
                  <p className="truncate font-label-sm text-label-sm text-outline">
                    {quantity} × {formatPrice(unitPrice)} ·{" "}
                    {order.vendor?.name || "PizzaHub kitchen"}
                  </p>
                </div>
                <p className="shrink-0 font-label-lg text-label-lg font-bold text-charcoal-dark">
                  {formatPrice(subtotal)}
                </p>
              </div>

              <dl className="mt-space-md space-y-space-xs border-t border-surface-container-high pt-space-sm font-body-md text-body-md">
                <div className="flex items-center justify-between">
                  <dt className="text-on-surface-variant">Subtotal</dt>
                  <dd className="text-charcoal-dark">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-on-surface-variant">Delivery fee</dt>
                  <dd className="font-label-sm text-label-sm text-outline">
                    Confirmed by the kitchen
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-surface-container-high pt-space-sm">
                  <dt className="font-label-lg text-label-lg font-bold text-charcoal-dark">
                    Total
                  </dt>
                  <dd className="font-headline-sm text-headline-sm font-bold text-primary">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <h2 className="font-title-md text-title-md text-charcoal-dark">
              Delivery details
            </h2>

            <dl className="mt-space-sm grid gap-space-sm sm:grid-cols-2">
              <div>
                <dt className={labelClassName}>Recipient</dt>
                <dd className="mt-1 font-label-lg text-label-lg text-charcoal-dark">
                  {customer?.name || "Not provided"}
                </dd>
              </div>

              <div>
                <dt className={labelClassName}>Phone</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-label-lg text-label-lg text-charcoal-dark">
                  <Phone className="text-outline" size={13} />
                  {customer?.phone || "Not provided"}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className={labelClassName}>Address</dt>
                <dd className="mt-1 flex items-start gap-1.5 font-body-md text-body-md text-on-surface-variant">
                  <MapPin className="mt-0.5 shrink-0 text-outline" size={14} />
                  <span>{customer?.address || "Address not provided"}</span>
                </dd>
              </div>

              {customer?.note ? (
                <div className="sm:col-span-2">
                  <dt className={labelClassName}>Delivery note</dt>
                  <dd className="mt-space-xs rounded-xl border-l-2 border-crust-gold/60 bg-surface-container-low px-space-sm py-space-xs font-body-md text-body-md italic text-on-surface-variant">
                    “{customer.note}”
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <aside className="space-y-space-md">
          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <h2 className="font-title-md text-title-md text-charcoal-dark">
              Fulfilled by
            </h2>

            <div className="mt-space-sm flex items-center gap-space-sm">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                <Image
                  alt={order.vendor?.name || "Vendor"}
                  className="object-cover"
                  fill
                  sizes="48px"
                  src={vendorImage}
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                  {order.vendor?.name || "Vendor unavailable"}
                </p>
                <p className="font-label-sm text-label-sm text-outline">
                  PizzaHub partner kitchen
                </p>
              </div>
            </div>

            <div className="mt-space-md space-y-space-xs border-t border-surface-container-high pt-space-sm">
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-outline">Payment</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-charcoal-dark">
                  <PaymentIcon size={13} />
                  {paymentLabel(order.payment)}
                </span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-outline">Order ID</span>
                
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-md shadow-sm">
            <h2 className="font-title-md text-title-md text-charcoal-dark">
              Order actions
            </h2>

            <div className="mt-space-sm flex flex-col gap-space-sm">
              <CancelOrderButton order={order} />

              <Link
                className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
                href="/"
              >
                <Plus size={16} />
                Order again
              </Link>

              <Link
                className="inline-flex items-center justify-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                href="/user/dashboard/order"
              >
                <ArrowRight size={16} />
                All orders
              </Link>
            </div>

            <p className="mt-space-sm flex items-start gap-space-xs font-label-sm text-label-sm text-outline">
              <ReceiptText className="mt-0.5 shrink-0" size={13} />
              Status updates are posted by the kitchen. Call the vendor if
              something looks off.
            </p>
          </section>

          {isCancelled ? (
            <p className="flex items-center justify-center gap-space-xs rounded-2xl bg-surface-container-low px-space-md py-space-sm text-center font-label-sm text-label-sm text-on-surface-variant">
              <Pizza size={14} />
              Hungry again? The oven is still hot.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default UserOrderDetailesPage;
