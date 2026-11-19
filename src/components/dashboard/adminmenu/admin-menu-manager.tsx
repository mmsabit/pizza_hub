"use client";


import Image from "next/image";


import { PizzaType } from "@/app/type/type";
import Link from "next/link";
import AdminStatusBadge from "./adminstatusbadge";
import { useState } from "react";






const formatPrice = (price: PizzaType["price"]) => {
  const amount = typeof price === "number" ? price : Number(price);

  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "Price unavailable";
};

function TypeChip({ category }: { category: string }) {
  return (
    <span className="inline-flex w-fit whitespace-nowrap items-center rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
      {category}
    </span>
  );
}

function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-space-xs rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${
        available
          ? "bg-tertiary-fixed text-on-tertiary-fixed"
          : "bg-error-container text-on-error-container"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          available ? "bg-tertiary" : "bg-error"
        }`}
      />
      {available ? "Available" : "Sold out"}
    </span>
  );
}



interface MenuManagerProps { 
  ITEMS: PizzaType[];
}

export function AdminMenuManager({ITEMS}:MenuManagerProps) {
  const [items, setItems] = useState(ITEMS);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const availableCount = items.filter((item) => item.available).length;

  async function updateStatus(item: PizzaType, status: "approved" | "rejected") {
    setUpdatingId(item._id);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adminmenu/${item._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Could not update menu status.");
      }

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem._id === item._id ? { ...currentItem, status } : currentItem,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update menu status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function StatusActions({ item }: { item: PizzaType }) {
    if (item.status !== "pending") return null;

    return (
      <div className="flex items-center gap-space-xs">
        <button
          className="btn btn-sm btn-success text-white"
          disabled={updatingId === item._id}
          onClick={() => updateStatus(item, "approved")}
          type="button"
        >
          Approve
        </button>
        <button
          className="btn btn-sm btn-error text-white"
          disabled={updatingId === item._id}
          onClick={() => updateStatus(item, "rejected")}
          type="button"
        >
          Reject
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-space-lg">
      <header className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
            Kitchen
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
            Menu
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {items.length} {items.length === 1 ? "dish" : "dishes"} on the board •{" "}
            {availableCount} available tonight
          </p>
        </div>

        
      </header>

      {error ? (
        <p className="rounded-xl bg-error-container px-space-md py-space-sm text-on-error-container" role="alert">
          {error}
        </p>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm">
        <div className="hidden items-center gap-space-sm border-b border-surface-container-high px-space-md py-space-sm font-label-sm text-label-sm uppercase tracking-wider text-outline sm:flex">
          <span className="w-11 shrink-0" />
          <span className="min-w-0 flex-1">Menu name</span>
          <span className="w-44 shrink-0">Type</span>
          <span className="w-20 shrink-0 text-right">Price</span>
          <span className="w-28 shrink-0 text-right">Availability</span>
          <span className="w-28 shrink-0 text-right">Status</span>
          <span className="w-28 shrink-0 text-right"> </span>
        </div>

        <ul className="divide-y divide-surface-container-high">
          {items.map((item) => (
            <li
              key={item._id}
              className="flex flex-wrap items-center gap-space-sm px-space-md py-space-md transition-colors hover:bg-surface-container-low"
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                <Image
                  alt={item.name}
                  className="object-cover"
                  fill
                  sizes="44px"
                  src={item.image}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                  {item.name}
                </p>
                
              </div>

              <span className="hidden w-44 shrink-0 sm:block">
                <TypeChip category={item.category} />
              </span>
              <p className="hidden w-20 shrink-0 text-right font-label-lg text-label-lg font-bold text-primary sm:block">
                {formatPrice(item.price)}
              </p>
              <span className="hidden w-28 shrink-0 justify-end sm:flex">
                <AvailabilityBadge available={item.available} />
              </span>
              <span className="hidden w-28 shrink-0 justify-end sm:flex">
                <AdminStatusBadge status={item.status} />
              </span>
              <span className="hidden w-28 shrink-0 justify-end sm:flex">
                <Link
                href={`/menu/${item._id}`}
                className="btn btn-sm btn-soft btn-primary"
                >View Details</Link>
              </span>
              <span className="hidden shrink-0 items-center gap-space-xs sm:flex">
                <StatusActions item={item} />
              </span>

              <div className="flex w-full flex-wrap items-center justify-between gap-space-sm pl-14 sm:hidden">
                <TypeChip category={item.category} />
                <p className="font-label-lg text-label-lg font-bold text-primary">
                  {formatPrice(item.price)}
                </p>
                <AvailabilityBadge available={item.available} />
                <AdminStatusBadge status={item.status}/>
                <Link
                href={`/menu/${item._id}`}
                className="btn btn-ghost"
                >View Details</Link>
                <StatusActions item={item} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      
    </div>
  );
}
