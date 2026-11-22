"use client";

import { Crown, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { PizzaType } from "@/app/type/type";
import Link from "next/link";
import { MenuFormModal } from "./menu-form-modal";




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

export interface StatusType {
  status: "pending" | "approved" | "rejected";
}

const StatusBadge = ({ status }: StatusType) => {
  return (
    <span
      className={`inline-flex w-fit items-center gap-space-xs rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold ${
        status === "pending"
          ? "bg-yellow-100 text-on-tertiary-fixed"
          : status === "rejected"
            ? "bg-red-300 text-on-tertiary-fixed"
            : "bg-tertiary-fixed text-on-tertiary-fixed"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "pending"
            ? "bg-yellow-500"
            : status === "rejected"
              ? "bg-error"
              : "bg-tertiary"
        }`}
      />
      {status}
    </span>
  );
};

interface MenuManagerProps {
  userName: string;
  userImage: string;
  userId:string;
  ITEMS: PizzaType[];
  premium: boolean;
}

export function MenuManager({userName, userImage,userId, ITEMS, premium}:MenuManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [featuredOverrides, setFeaturedOverrides] = useState<Record<string, boolean>>({});
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState<string | null>(null);
  const [featuredError, setFeaturedError] = useState("");
  const items = ITEMS.map((item) => {
    const featuredOverride = featuredOverrides[item._id];
    return featuredOverride === undefined
      ? item
      : { ...item, featured: featuredOverride };
  });
  const availableCount = items.filter((item) => item.available).length;

  async function updateFeatured(item: PizzaType, featured: boolean) {
    setUpdatingFeaturedId(item._id);
    setFeaturedError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menu/${item._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured }),
        },
      );

      if (response.status === 403) {
        throw new Error("Only Premium vendors can feature menu items.");
      }
      if (response.status === 422) {
        throw new Error("Only approved menu items can be featured.");
      }
      if (!response.ok) {
        throw new Error("Could not update featured menu status.");
      }

      setFeaturedOverrides((current) => ({
        ...current,
        [item._id]: featured,
      }));
    } catch (error) {
      setFeaturedError(
        error instanceof Error
          ? error.message
          : "Could not update featured menu status.",
      );
    } finally {
      setUpdatingFeaturedId(null);
    }
  }

  function FeaturedToggle({ item }: { item: PizzaType }) {
    const isFeatured = item.featured === true;

    if (item.status !== "approved") {
      return (
        <span className="font-label-sm text-label-sm text-outline">
          Available after approval
        </span>
      );
    }

    if (!premium && !isFeatured) {
      return (
        <Link
          className="inline-flex items-center gap-1 font-label-sm text-label-sm font-bold text-secondary hover:text-primary"
          href="/vendor/dashboard/plan"
        >
          <Crown size={12} />
          Premium to feature
        </Link>
      );
    }

    return (
      <label className="flex items-center gap-space-xs font-label-sm text-label-sm">
        <input
          aria-label={`Feature ${item.name}`}
          checked={isFeatured}
          className="checkbox checkbox-primary"
          disabled={updatingFeaturedId !== null}
          onChange={(event) => updateFeatured(item, event.target.checked)}
          type="checkbox"
        />
        <span>Featured</span>
      </label>
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

        <div className="flex flex-wrap items-center gap-space-sm">
          {premium ? (
            <span className="inline-flex items-center gap-space-xs rounded-full bg-crust-gold/15 px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-secondary">
              <Crown size={12} />
              Premium
            </span>
          ) : null}

          <button
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
            onClick={() => setFormOpen(true)}
            type="button"
          >
            <Plus size={16} />
            Add new menu
          </button>
        </div>
      </header>

      {featuredError ? (
        <p
          className="rounded-xl bg-error-container px-space-md py-space-sm text-on-error-container"
          role="alert"
        >
          {featuredError}
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
          <span className="w-36 shrink-0 text-right">Featured</span>
          <span className="w-28 shrink-0 text-right">Actions</span>
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
                <StatusBadge status={item.status} />
              </span>
              <span className="hidden w-36 shrink-0 justify-end sm:flex">
                <FeaturedToggle item={item} />
              </span>
              <span className="hidden w-28 shrink-0 justify-end sm:flex">
                <Link
                href={`/menu/${item._id}`}
                className="btn btn-sm btn-soft btn-primary"
                >View Details</Link>
              </span>

              <div className="flex w-full flex-wrap items-center justify-between gap-space-sm pl-14 sm:hidden">
                <TypeChip category={item.category} />
                <p className="font-label-lg text-label-lg font-bold text-primary">
                  {formatPrice(item.price)}
                </p>
                <AvailabilityBadge available={item.available} />
                <StatusBadge status={item.status}/>
                <FeaturedToggle item={item} />
                <Link
                href={`/menu/${item._id}`}
                className="btn btn-ghost"
                >View Details</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {formOpen ? (
        <MenuFormModal userName={userName} userImage={userImage} userId={userId} onClose={() => setFormOpen(false)} />
      ) : null}
    </div>
  );
}
