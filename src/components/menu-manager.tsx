"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MenuFormModal } from "./menu-form-modal";
import type { MenuDraft, MenuItem } from "@/lib/menu";

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: "margherita",
    name: "Margherita",
    category: "Pizza",
    description: "San Marzano tomato, fior di latte and torn basil on a 48-hour dough.",
    price: 14.5,
    image: "/images/menu-margherita.jpg",
    available: true,
  },
  {
    id: "pepperoni",
    name: "Double Pepperoni Picante",
    category: "Pizza",
    description: "Cup-and-char pepperoni, chilli honey and smoked mozzarella.",
    price: 16,
    image: "/images/menu-seafood.jpg",
    available: true,
  },
  {
    id: "mushroom",
    name: "Truffle Wild Mushroom",
    category: "Pizza",
    description: "Wild mushrooms, truffle cream and thyme on a garlic-white base.",
    price: 18.75,
    image: "/images/menu-caesar.jpg",
    available: true,
  },
  {
    id: "brisket",
    name: "Smoky BBQ Brisket",
    category: "Pizza",
    description: "Slow-braised brisket, red onion and a bourbon BBQ drizzle.",
    price: 19.5,
    image: "/images/menu-rum.jpg",
    available: false,
  },
];

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const ICON_BUTTON_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-full border border-surface-container-high text-on-surface-variant transition-colors";

function TypeChip({ category }: { category: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
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

export function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>(INITIAL_ITEMS);
  const [formItem, setFormItem] = useState<MenuItem | null | undefined>(undefined);

  const availableCount = items.filter((item) => item.available).length;
  const formOpen = formItem !== undefined;

  const handleSave = (draft: MenuDraft, id?: string) => {
    setItems((current) =>
      id
        ? current.map((item) => (item.id === id ? { ...draft, id } : item))
        : [{ ...draft, id: `custom-${Date.now()}` }, ...current],
    );
    setFormItem(undefined);
  };

  const handleDelete = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

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

        <button
          className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:bg-primary hover:-translate-y-0.5"
          onClick={() => setFormItem(null)}
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
          <span className="w-24 shrink-0">Type</span>
          <span className="w-20 shrink-0 text-right">Price</span>
          <span className="w-28 shrink-0 text-right">Availability</span>
          <span className="w-20 shrink-0 text-right">Actions</span>
        </div>

        <ul className="divide-y divide-surface-container-high">
          {items.map((item) => (
            <li
              key={item.id}
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
                <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                  {item.description || "No description yet."}
                </p>
              </div>

              <span className="hidden w-24 shrink-0 sm:block">
                <TypeChip category={item.category} />
              </span>
              <p className="hidden w-20 shrink-0 text-right font-label-lg text-label-lg font-bold text-primary sm:block">
                {formatPrice(item.price)}
              </p>
              <span className="hidden w-28 shrink-0 justify-end sm:flex">
                <AvailabilityBadge available={item.available} />
              </span>

              <div className="flex shrink-0 items-center gap-space-xs sm:w-20 sm:justify-end">
                <button
                  aria-label={`Edit ${item.name}`}
                  className={`${ICON_BUTTON_CLASS} hover:border-primary hover:text-primary`}
                  onClick={() => setFormItem(item)}
                  type="button"
                >
                  <Pencil size={15} />
                </button>
                <button
                  aria-label={`Delete ${item.name}`}
                  className={`${ICON_BUTTON_CLASS} hover:border-error hover:text-error`}
                  onClick={() => handleDelete(item.id)}
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="flex w-full items-center justify-between gap-space-sm pl-14 sm:hidden">
                <TypeChip category={item.category} />
                <p className="font-label-lg text-label-lg font-bold text-primary">
                  {formatPrice(item.price)}
                </p>
                <AvailabilityBadge available={item.available} />
              </div>
            </li>
          ))}

          {items.length === 0 ? (
            <li className="px-space-md py-space-lg text-center font-body-md text-body-md text-on-surface-variant">
              No dishes yet — add your first one.
            </li>
          ) : null}
        </ul>
      </section>

      {formOpen ? (
        <MenuFormModal
          key={formItem?.id ?? "add"}
          item={formItem}
          onClose={() => setFormItem(undefined)}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
