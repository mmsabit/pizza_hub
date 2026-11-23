"use client";


import Image from "next/image";
import { Store } from "lucide-react";

import { PizzaType } from "@/app/type/type";
import Link from "next/link";
import AdminStatusBadge from "./adminstatusbadge";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";






const formatPrice = (price: PizzaType["price"]) => {
  const amount = typeof price === "number" ? price : Number(price);

  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "Price unavailable";
};

function TypeChip({ category }: { category: string }) {
  return (
    <span className="inline-block max-w-full truncate rounded-full bg-surface-container-low px-space-sm py-space-xs align-middle font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
      {category}
    </span>
  );
}

function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-space-xs rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${
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
  const [items, setItems] = useState<PizzaType[]>(
    Array.isArray(ITEMS) ? ITEMS : []
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const availableCount = items.filter((item) => item.available).length;

  async function updateStatus(item: PizzaType, status: "approved" | "rejected") {
    setUpdatingId(item._id);
    setError("");

    const {data} = await authClient.token();
      const token = data?.token;
      
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/adminmenu/${item._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", authorization: `Bearer ${token}`, },
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
      <Reveal as="header" className="flex flex-wrap items-end justify-between gap-space-md">
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

        
      </Reveal>

      {error ? (
        <p className="rounded-xl bg-error-container px-space-md py-space-sm text-on-error-container" role="alert">
          {error}
        </p>
      ) : null}
      {/* Desktop / large screen table */}
      <Reveal
        as="section"
        className="hidden overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm xl:block"
        delay={0.08}
      >
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="border-b border-surface-container-high bg-surface-container-low">
            <tr className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              <th className="w-20 py-space-sm pl-space-md pr-space-sm" scope="col">
                <span className="sr-only">Image</span>
              </th>
              <th className="px-space-sm py-space-sm" scope="col">
                Menu name
              </th>
              <th
                className="hidden w-40 px-space-sm py-space-sm 2xl:table-cell"
                scope="col"
              >
                Type
              </th>
              <th
                className="w-24 px-space-sm py-space-sm text-right"
                scope="col"
              >
                Price
              </th>
              <th
                className="w-32 px-space-sm py-space-sm text-right"
                scope="col"
              >
                Availability
              </th>
              <th
                className="w-48 px-space-sm py-space-sm text-right"
                scope="col"
              >
                Status
              </th>
              <th
                className="w-36 py-space-sm pl-space-sm pr-space-md text-right"
                scope="col"
              >
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container-high">
            {items.map((item) => (
              <tr
                key={item._id}
                className="transition-colors hover:bg-surface-container-low"
              >
                <td className="py-space-md pl-space-md pr-space-sm">
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-surface-container-low">
                    <Image
                      alt={item.name}
                      className="object-cover"
                      fill
                      sizes="44px"
                      src={item.image}
                    />
                  </div>
                </td>

                <td className="px-space-sm py-space-md">
                  <div className="min-w-0">
                    <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                      {item.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                      <Store className="shrink-0 text-outline" size={12} />
                      <span className="truncate">
                        {item.vendor?.name || "Vendor unavailable"}
                      </span>
                    </p>
                  </div>
                </td>

                <td className="hidden px-space-sm py-space-md 2xl:table-cell">
                  <TypeChip category={item.category} />
                </td>

                <td className="whitespace-nowrap px-space-sm py-space-md text-right font-label-lg text-label-lg font-bold text-primary">
                  {formatPrice(item.price)}
                </td>

                <td className="px-space-sm py-space-md">
                  <div className="flex justify-end">
                    <AvailabilityBadge available={item.available} />
                  </div>
                </td>

                <td className="px-space-sm py-space-md">
                  <div className="flex items-center justify-end">
                    {item.status === "pending" ? (
                      <StatusActions item={item} />
                    ) : (
                      <AdminStatusBadge status={item.status} />
                    )}
                  </div>
                </td>

                <td className="py-space-md pl-space-sm pr-space-md text-right">
                  <Link
                    href={`/menu/${item._id}`}
                    className="btn btn-sm btn-soft btn-primary"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* Mobile / tablet cards */}
      <Stagger
        as="ul"
        className="divide-y divide-surface-container-high overflow-hidden rounded-2xl border border-surface-container-high bg-surface-container-lowest shadow-sm xl:hidden"
        stagger={0.05}
      >
        {items.map((item) => (
          <StaggerItem
            as="li"
            key={item._id}
            className="px-space-md py-space-md transition-colors hover:bg-surface-container-low"
          >
            <div className="flex items-center gap-space-sm">
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
                <p className="mt-0.5 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                  <Store className="shrink-0 text-outline" size={12} />
                  <span className="truncate">
                    {item.vendor?.name || "Vendor unavailable"}
                  </span>
                </p>
              </div>

              <AvailabilityBadge available={item.available} />
            </div>

            <div className="mt-space-sm flex flex-wrap items-center gap-space-sm pl-14">
              <TypeChip category={item.category} />
              <p className="font-label-lg text-label-lg font-bold text-primary">
                {formatPrice(item.price)}
              </p>
              {item.status === "pending" ? (
                <StatusActions item={item} />
              ) : (
                <>
                  <AdminStatusBadge status={item.status} />
                </>
              )}

              <Link
                href={`/menu/${item._id}`}
                className="btn btn-sm btn-soft btn-primary ml-auto"
              >
                View Details
              </Link>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
