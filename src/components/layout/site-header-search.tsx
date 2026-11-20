"use client";

import { ArrowRight, Loader2, Pizza, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { PizzaType } from "@/app/type/type";

const PLACEHOLDER_IMAGE = "/images/placeholder.png";
const DEBOUNCE_MS = 300;
const MIN_TERM_LENGTH = 2;

const formatPrice = (price: PizzaType["price"]) => {
  const amount = typeof price === "number" ? price : Number(price);

  return Number.isFinite(amount) && amount > 0
    ? `৳${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    : "Price on request";
};

const extractItems = (data: unknown): PizzaType[] => {
  if (Array.isArray(data)) return data as PizzaType[];

  const record = data as
    | { menus?: unknown; results?: unknown; data?: unknown }
    | null;

  for (const candidate of [record?.menus, record?.results, record?.data]) {
    if (Array.isArray(candidate)) return candidate as PizzaType[];
  }

  return [];
};

export function SiteHeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PizzaType[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const term = query.trim();

    if (term.length < MIN_TERM_LENGTH) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setState("loading");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menus/search?search=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error("Search failed");

        const data = await res.json();
        setResults(extractItems(data));
        setState("ready");
        setActiveIndex(-1);
      } catch {
        if (controller.signal.aborted) return;

        setResults([]);
        setState("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const term = query.trim();
  const showDropdown = open && term.length >= MIN_TERM_LENGTH;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (results.length === 0) return;

      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        if (event.key === "ArrowDown") {
          return current >= results.length - 1 ? 0 : current + 1;
        }
        return current <= 0 ? results.length - 1 : current - 1;
      });
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      router.push(`/menu/${results[activeIndex]._id}`);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) router.push(`/menu/${results[0]._id}`);
        }}
        role="search"
      >
        <Search
          aria-hidden
          className="pointer-events-none absolute left-space-md top-1/2 -translate-y-1/2 text-outline"
          size={18}
        />

        <input
          aria-autocomplete="list"
          aria-controls="site-header-search-results"
          aria-expanded={showDropdown}
          aria-label="Search the menu"
          autoComplete="off"
          className="w-full rounded-full bg-surface-container-lowest py-space-sm pl-10 pr-10 text-body-md text-on-surface shadow-[0_2px_8px_rgba(253,157,62,0.06)] outline-none placeholder:text-outline focus:ring-2 focus:ring-primary-container"
          onChange={(event) => {
            const value = event.target.value;

            if (value.trim().length < MIN_TERM_LENGTH) {
              setResults([]);
              setState("idle");
              setActiveIndex(-1);
            }

            setQuery(value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search wood-fired pies, dips, drinks..."
          role="combobox"
          type="text"
          value={query}
        />

        {state === "loading" ? (
          <Loader2
            aria-hidden
            className="absolute right-space-md top-1/2 -translate-y-1/2 animate-spin text-outline"
            size={16}
          />
        ) : query ? (
          <button
            aria-label="Clear search"
            className="absolute right-space-xs top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container-low hover:text-charcoal-dark"
            onClick={() => {
              setQuery("");
              setResults([]);
              setState("idle");
              setOpen(false);
            }}
            type="button"
          >
            <X size={15} />
          </button>
        ) : null}
      </form>

      {showDropdown ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-surface-container-high bg-dough-canvas shadow-2xl"
          id="site-header-search-results"
          role="listbox"
        >
          <div className="flex items-center justify-between gap-space-sm border-b border-surface-container-high bg-surface-container-low px-space-md py-space-xs">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-outline">
              Menu results
            </span>
            {state === "ready" && results.length > 0 ? (
              <span className="font-label-sm text-label-sm text-outline">
                {results.length}
              </span>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {state === "loading" && results.length === 0 ? (
              <p className="px-space-md py-space-lg text-center font-body-md text-body-md text-on-surface-variant">
                Searching the kitchen…
              </p>
            ) : state === "error" ? (
              <p className="px-space-md py-space-lg text-center font-body-md text-body-md text-error">
                Search is unavailable right now. Try again in a moment.
              </p>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center gap-space-xs px-space-md py-space-lg text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-outline">
                  <Pizza size={18} />
                </span>
                <p className="font-label-lg text-label-lg text-charcoal-dark">
                  No dishes match “{term}”
                </p>
                <p className="font-label-sm text-label-sm text-outline">
                  Try a shorter keyword or browse the full menu.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-surface-container-high">
                {results.map((item, index) => (
                  <li key={item._id}>
                    <Link
                      aria-selected={index === activeIndex}
                      className={`flex items-center gap-space-sm px-space-md py-space-sm transition-colors ${
                        index === activeIndex
                          ? "bg-surface-container-low"
                          : "hover:bg-surface-container-low/70"
                      }`}
                      href={`/menu/${item._id}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActiveIndex(index)}
                      role="option"
                    >
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-surface-container-low">
                        <Image
                          alt={item.name}
                          className="object-cover"
                          fill
                          sizes="44px"
                          src={item.image || PLACEHOLDER_IMAGE}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                          {item.name}
                        </p>
                        <p className="truncate font-label-sm text-label-sm text-outline">
                          {item.category}
                          {item.vendor?.name ? ` · ${item.vendor.name}` : ""}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-label-lg text-label-lg font-bold text-primary">
                          {formatPrice(item.price)}
                        </p>
                        <p
                          className={`font-label-sm text-label-sm ${
                            item.available ? "text-tertiary" : "text-error"
                          }`}
                        >
                          {item.available ? "Available" : "Sold out"}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            className="flex items-center justify-between gap-space-sm border-t border-surface-container-high bg-surface-container-low px-space-md py-space-sm font-label-md text-label-md font-bold uppercase tracking-wider text-primary transition-colors hover:bg-surface-container-high"
            href="/menu"
            onClick={() => setOpen(false)}
          >
            Browse the full menu
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
