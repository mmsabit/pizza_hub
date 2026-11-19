"use client";

import { Plus } from "lucide-react";
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
}

export function MenuManager({userName, userImage,userId, ITEMS}:MenuManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const availableCount = ITEMS.filter((item) => item.available).length;

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
            {ITEMS.length} {ITEMS.length === 1 ? "dish" : "dishes"} on the board •{" "}
            {availableCount} available tonight
          </p>
        </div>

        <button
          className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
          onClick={() => setFormOpen(true)}
          type="button"
        >
          <Plus size={16} />
          Add new menu
        </button>
      </header>

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
          {ITEMS.map((item) => (
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
                {/* <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                  {item.description || "No description yet."}
                </p> */}
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
