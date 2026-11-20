"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Flame,
  Pizza,
  Search,
  SlidersHorizontal,
  Store,
  Tag,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

import type { PizzaType } from "@/app/type/type";

const PLACEHOLDER_IMAGE = "/images/placeholder.png";

const priceOf = (price: PizzaType["price"]) => {
  const value = typeof price === "number" ? price : Number(price);
  return Number.isFinite(value) ? value : 0;
};

const formatPrice = (price: PizzaType["price"]) => {
  const value = priceOf(price);
  if (value <= 0) return "Price on request";

  return `৳${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};

const SORTS = [
  { key: "default", label: "Kitchen order" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Name: A to Z" },
] as const;

type SortKey = (typeof SORTS)[number]["key"];

const STATUS_FILTERS = [
  { key: "all", label: "Everything" },
  { key: "available", label: "Available now" },
  { key: "sold-out", label: "Sold out" },
] as const;

type StatusKey = (typeof STATUS_FILTERS)[number]["key"];

const searchableText = (item: PizzaType) =>
  [item.name, item.category, item.description, item.vendor?.name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

function FilterSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-surface-container-high px-space-md py-space-md first:border-t-0">
      <div className="mb-space-sm flex items-baseline justify-between gap-space-sm">
        <p className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-charcoal-dark">
          {title}
        </p>
        {hint ? (
          <span className="font-label-sm text-label-sm text-outline">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function MenuBrowser({ items }: { items: PizzaType[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusKey>("all");
  const [sort, setSort] = useState<SortKey>("default");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const seen = new Map<string, number>();

    for (const item of items) {
      const key = item.category || "Uncategorised";
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }

    return [...seen.entries()].map(([label, count]) => ({ label, count }));
  }, [items]);

  const priceBounds = useMemo(() => {
    const values = items.map((item) => priceOf(item.price)).filter((value) => value > 0);

    return { max: values.length > 0 ? Math.ceil(Math.max(...values)) : 0 };
  }, [items]);

  const availableCount = useMemo(
    () => items.filter((item) => item.available).length,
    [items],
  );

  const priceCeiling = priceBounds.max;
  const activeMaxPrice = maxPrice ?? priceCeiling;

  const counts = {
    all: items.length,
    available: availableCount,
    "sold-out": items.length - availableCount,
  } as const;

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = items.filter((item) => {
      if (category !== "all" && (item.category || "Uncategorised") !== category) {
        return false;
      }

      if (status === "available" && !item.available) return false;
      if (status === "sold-out" && item.available) return false;

      if (priceCeiling > 0 && priceOf(item.price) > activeMaxPrice) return false;

      return needle === "" || searchableText(item).includes(needle);
    });

    if (sort === "default") return filtered;

    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return priceOf(a.price) - priceOf(b.price);
      if (sort === "price-desc") return priceOf(b.price) - priceOf(a.price);
      return a.name.localeCompare(b.name);
    });
  }, [items, query, category, status, sort, priceCeiling, activeMaxPrice]);

  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (maxPrice !== null && priceCeiling > 0 && maxPrice < priceCeiling ? 1 : 0);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setSort("default");
    setMaxPrice(null);
  };

  return (
    <div className="w-full bg-dough-canvas">
      {/* Hero + search */}
      <section className="relative overflow-hidden border-b border-surface-container-high bg-dough-surface">
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-secondary-container/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-1/3 h-125 w-125 rounded-full bg-primary-container/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-margin py-space-xl">
          <p className="font-label-md text-label-md font-bold uppercase tracking-widest text-secondary">
            Fresh from the oven
          </p>
          <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-extrabold uppercase tracking-tight text-charcoal-dark sm:text-headline-lg">
            The full PizzaHub menu
          </h1>
          <p className="mt-space-sm max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            {items.length > 0
              ? `${items.length} dishes from our partner kitchens — ${availableCount} ready to bake right now.`
              : "Our partner kitchens are restocking. Check back in a moment for tonight's pies."}
          </p>

          <div className="mt-space-lg max-w-3xl">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
                size={20}
              />
              <input
                aria-label="Search the menu"
                className="w-full rounded-2xl border border-surface-container-high bg-surface-container-lowest py-space-md pl-12 pr-12 font-body-md text-body-md text-charcoal-dark shadow-sm outline-none transition-colors placeholder:text-outline focus:border-primary-container focus:ring-2 focus:ring-primary-fixed"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pizzas, sides, drinks or a kitchen…"
                type="search"
                value={query}
              />
              {query ? (
                <button
                  aria-label="Clear search"
                  className="absolute right-space-sm top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-outline transition-colors hover:bg-surface-container-high hover:text-charcoal-dark"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-space-lg px-margin py-space-xl lg:grid-cols-[17rem_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="lg:sticky lg:top-space-lg lg:self-start">
          <div className="mb-space-sm flex items-center justify-between gap-space-sm lg:hidden">
            <button
              aria-expanded={filtersOpen}
              className="inline-flex items-center gap-space-xs rounded-xl border border-surface-container-high bg-surface-container-lowest px-space-md py-space-sm font-label-lg text-label-lg text-charcoal-dark shadow-sm"
              onClick={() => setFiltersOpen((open) => !open)}
              type="button"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-primary-container px-1.5 font-label-sm text-label-sm text-on-primary-container">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
            {activeFilterCount > 0 || query ? (
              <button
                className="font-label-lg text-label-lg text-primary transition-colors hover:text-primary-container"
                onClick={resetFilters}
                type="button"
              >
                Reset
              </button>
            ) : null}
          </div>

          <div
            className={`${
              filtersOpen ? "block" : "hidden"
            } overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm lg:block`}
          >
            <div className="flex items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-sm">
              <p className="inline-flex items-center gap-space-xs font-label-md text-label-md font-bold uppercase tracking-widest text-charcoal-dark">
                <SlidersHorizontal size={14} />
                Sort &amp; filter
              </p>
              {activeFilterCount > 0 || query ? (
                <button
                  className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary-container"
                  onClick={resetFilters}
                  type="button"
                >
                  Reset
                </button>
              ) : null}
            </div>

            <FilterSection title="Sort by" hint="Price">
              <div className="space-y-1">
                {SORTS.map((entry) => (
                  <label
                    key={entry.key}
                    className="flex cursor-pointer items-center gap-space-sm rounded-lg px-1 py-1.5 font-body-md text-body-md text-on-surface-variant transition-colors hover:text-charcoal-dark"
                  >
                    <input
                      checked={sort === entry.key}
                      className="h-4 w-4 accent-primary"
                      name="menu-sort"
                      onChange={() => setSort(entry.key)}
                      type="radio"
                      value={entry.key}
                    />
                    {entry.label}
                  </label>
                ))}
              </div>
            </FilterSection>

            {priceCeiling > 0 ? (
              <FilterSection title="Max price" hint={formatPrice(activeMaxPrice)}>
                <input
                  aria-label="Maximum price"
                  className="w-full accent-primary"
                  max={priceCeiling}
                  min={0}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  step={10}
                  type="range"
                  value={activeMaxPrice}
                />
                <div className="mt-1 flex items-center justify-between font-label-sm text-label-sm text-outline">
                  <span>৳0</span>
                  <span>৳{priceCeiling}</span>
                </div>
              </FilterSection>
            ) : null}

            <FilterSection title="Categories" hint={`${categories.length}`}>
              <div className="space-y-1">
                <label className="flex cursor-pointer items-center justify-between gap-space-sm rounded-lg px-1 py-1.5 font-body-md text-body-md text-on-surface-variant transition-colors hover:text-charcoal-dark">
                  <span className="inline-flex items-center gap-space-sm">
                    <input
                      checked={category === "all"}
                      className="h-4 w-4 accent-primary"
                      name="menu-category"
                      onChange={() => setCategory("all")}
                      type="radio"
                    />
                    All categories
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">{items.length}</span>
                </label>

                {categories.map((entry) => (
                  <label
                    key={entry.label}
                    className="flex cursor-pointer items-center justify-between gap-space-sm rounded-lg px-1 py-1.5 font-body-md text-body-md text-on-surface-variant transition-colors hover:text-charcoal-dark"
                  >
                    <span className="inline-flex min-w-0 items-center gap-space-sm">
                      <input
                        checked={category === entry.label}
                        className="h-4 w-4 shrink-0 accent-primary"
                        name="menu-category"
                        onChange={() => setCategory(entry.label)}
                        type="radio"
                      />
                      <span className="truncate">{entry.label}</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">{entry.count}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Status" hint="Available">
              <div className="space-y-1">
                {STATUS_FILTERS.map((entry) => (
                  <button
                    key={entry.key}
                    aria-pressed={status === entry.key}
                    className={`flex w-full items-center justify-between gap-space-sm rounded-lg px-1 py-1.5 text-left font-body-md text-body-md transition-colors ${
                      status === entry.key
                        ? "font-bold text-primary"
                        : "text-on-surface-variant hover:text-charcoal-dark"
                    }`}
                    onClick={() => setStatus(entry.key)}
                    type="button"
                  >
                    <span className="inline-flex items-center gap-space-sm">
                      {entry.key === "available" ? (
                        <CheckCircle2 className="text-tertiary" size={14} />
                      ) : entry.key === "sold-out" ? (
                        <XCircle className="text-error" size={14} />
                      ) : (
                        <Pizza className="text-outline" size={14} />
                      )}
                      {entry.label}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {counts[entry.key]}
                    </span>
                  </button>
                ))}
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Results */}
        <section className="min-w-0">
          <div className="mb-space-md flex flex-wrap items-center justify-between gap-space-sm">
            <p className="font-label-lg text-label-lg text-on-surface-variant">
              {visibleItems.length === 1
                ? "1 dish on the board"
                : `${visibleItems.length} dishes on the board`}
              {query.trim() ? ` for “${query.trim()}”` : ""}
            </p>
            <label className="inline-flex items-center gap-space-sm font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Sort
              <select
                aria-label="Sort menu"
                className="rounded-lg border border-surface-container-high bg-surface-container-lowest px-space-sm py-1.5 font-label-md text-label-md text-charcoal-dark outline-none focus:border-primary-container"
                onChange={(event) => setSort(event.target.value as SortKey)}
                value={sort}
              >
                {SORTS.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {visibleItems.length === 0 ? (
            <div className="flex flex-col items-center gap-space-sm rounded-3xl border border-dashed border-outline-variant/70 bg-surface-container-lowest px-space-md py-space-xl text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                <Pizza size={26} />
              </span>
              <p className="font-title-md text-title-md text-charcoal-dark">
                {items.length === 0 ? "No dishes yet" : "Nothing matches those filters"}
              </p>
              <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
                {items.length === 0
                  ? "Our kitchens are still firing up. Fresh dishes will appear on this board soon."
                  : "Try a different keyword, raise the price limit or switch the status filter back to everything."}
              </p>
              {items.length > 0 ? (
                <button
                  className="mt-space-xs inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-md py-space-sm font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
                  onClick={resetFilters}
                  type="button"
                >
                  Clear filters
                  <X size={14} />
                </button>
              ) : null}
            </div>
          ) : (
            <ul className="grid gap-space-md sm:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((item) => (
                <li key={item._id}>
                  <Link
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-container/40 hover:shadow-xl"
                    href={`/menu/${item._id}`}
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-container-low">
                      <Image
                        alt={`${item.name} — ${item.category}`}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        fill
                        sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
                        src={item.image || PLACEHOLDER_IMAGE}
                      />

                      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-space-xs p-space-sm">
                        <span className="inline-flex max-w-[70%] items-center gap-1 truncate rounded-full bg-dough-canvas/95 px-space-sm py-space-xs font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur">
                          <Tag className="shrink-0" size={12} />
                          <span className="truncate">{item.category}</span>
                        </span>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-space-sm py-space-xs font-label-sm text-label-sm font-bold shadow-sm backdrop-blur ${
                            item.available
                              ? "bg-basil-fresh/90 text-white"
                              : "bg-charcoal-dark/90 text-surface-container-lowest"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.available ? "bg-white" : "bg-crust-gold"
                            }`}
                          />
                          {item.available ? "Available" : "Sold out"}
                        </span>
                      </div>

                      {item.featured ? (
                        <span className="absolute bottom-space-sm left-space-sm inline-flex items-center gap-1 rounded-full bg-charcoal-dark/90 px-space-sm py-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-crust-gold backdrop-blur">
                          <Flame size={12} />
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col gap-space-xs p-space-md">
                      <div className="flex items-start justify-between gap-space-sm">
                        <h2 className="font-title-md text-title-md text-charcoal-dark">
                          {item.name}
                        </h2>
                        {item.status && item.status !== "approved" ? (
                          <span className="shrink-0 rounded-full bg-surface-container-low px-space-sm py-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                            {item.status}
                          </span>
                        ) : null}
                      </div>

                      <p className="line-clamp-2 font-body-md text-body-md text-on-surface-variant">
                        {item.description ||
                          "A handcrafted PizzaHub creation, baked to order and served oven-warm."}
                      </p>

                      <div className="mt-auto flex items-end justify-between gap-space-sm pt-space-sm">
                        <div className="min-w-0">
                          <p className="font-headline-sm text-headline-sm font-extrabold text-primary">
                            {formatPrice(item.price)}
                          </p>
                          <p className="flex min-w-0 items-center gap-1 font-label-sm text-label-sm text-outline">
                            <Store className="shrink-0" size={12} />
                            <span className="truncate">
                              {item.vendor?.name || "PizzaHub kitchen"}
                            </span>
                          </p>
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-charcoal-dark px-space-sm py-2 font-label-sm text-label-sm text-surface-container-lowest transition-colors group-hover:bg-primary-container">
                          Details
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
