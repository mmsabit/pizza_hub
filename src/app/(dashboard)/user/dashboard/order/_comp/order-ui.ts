import type { OrderStateType, OrderType } from "@/app/type/type";

export const PLACEHOLDER_IMAGE = "/images/placeholder.png";

export const formatPrice = (value: number) =>
  `৳${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export const orderImage = (order: Pick<OrderType, "menuImage">) =>
  order.menuImage || PLACEHOLDER_IMAGE;



export const paymentLabel = (payment?: string) => {
  if (!payment) return "Payment not set";

  return payment
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export const ACTIVE_STATUSES: OrderStateType[] = [
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
];

export type StatusMeta = {
  label: string;
  description: string;
  chipClassName: string;
  dotClassName: string;
};

export const STATUS_META: Record<OrderStateType, StatusMeta> = {
  PENDING: {
    label: "Pending",
    description: "Waiting for the kitchen to confirm",
    chipClassName: "bg-crust-gold/20 text-secondary",
    dotClassName: "bg-crust-gold",
  },
  CONFIRMED: {
    label: "Confirmed",
    description: "The kitchen accepted your order",
    chipClassName: "bg-secondary-fixed text-on-secondary-fixed-variant",
    dotClassName: "bg-secondary",
  },
  PREPARING: {
    label: "In the oven",
    description: "Dough is on the stone right now",
    chipClassName: "bg-primary-fixed text-on-primary-fixed-variant",
    dotClassName: "bg-primary-container",
  },
  READY: {
    label: "Ready",
    description: "Boxed and waiting for the rider",
    chipClassName: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    dotClassName: "bg-basil-fresh",
  },
  OUT_FOR_DELIVERY: {
    label: "On the way",
    description: "The rider is heading your way",
    chipClassName: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    dotClassName: "bg-tertiary",
  },
  DELIVERED: {
    label: "Delivered",
    description: "Delivered — enjoy every slice",
    chipClassName: "bg-surface-container-low text-tertiary",
    dotClassName: "bg-tertiary",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This order was cancelled",
    chipClassName: "bg-error-container text-on-error-container",
    dotClassName: "bg-error",
  },
};

export const FALLBACK_STATUS: StatusMeta = {
  label: "Awaiting update",
  description: "The kitchen has not posted a status yet",
  chipClassName: "bg-surface-container-low text-on-surface-variant",
  dotClassName: "bg-outline",
};

export const statusMeta = (status: OrderStateType) =>
  STATUS_META[status] ?? FALLBACK_STATUS;

export const STATUS_STEPS: {
  status: OrderStateType;
  label: string;
  hint: string;
}[] = [
  { status: "PENDING", label: "Placed", hint: "Request sent to the kitchen" },
  { status: "CONFIRMED", label: "Confirmed", hint: "Kitchen accepted the ticket" },
  { status: "PREPARING", label: "In the oven", hint: "Baking on the stone" },
  { status: "READY", label: "Ready", hint: "Boxed and on the pass" },
  {
    status: "OUT_FOR_DELIVERY",
    label: "On the way",
    hint: "Rider is rolling to you",
  },
  { status: "DELIVERED", label: "Delivered", hint: "Handed over at your door" },
];

export const statusStepIndex = (status: OrderStateType) =>
  STATUS_STEPS.findIndex((step) => step.status === status);

export const statusProgress = (status: OrderStateType) => {
  if (status === "DELIVERED") return 100;

  const index = statusStepIndex(status);
  if (index < 0) return 0;

  return Math.round((index / (STATUS_STEPS.length - 1)) * 100);
};

/**
 * MongoDB ObjectIds carry their creation time in the first four bytes, so the
 * order id doubles as a placed-at timestamp without a schema change.
 */
export const orderTimestamp = (id: string) => {
  const hex = id?.slice(0, 8) ?? "";
  if (!/^[\da-f]{8}$/i.test(hex)) return 0;

  const timestamp = Number.parseInt(hex, 16) * 1000;
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const orderPlacedAt = (id: string) => {
  const timestamp = orderTimestamp(id);
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const year = date.getFullYear();

  return year >= 2020 && year <= 2100 ? date : null;
};

export const formatPlacedAt = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
