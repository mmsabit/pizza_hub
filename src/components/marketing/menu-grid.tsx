"use client";

import { useMemo, useState } from "react";
import { PizzaType } from "@/app/type/type";
import Image from "next/image";
import Link from "next/link";

export function MenuGrid({ items }: { items: PizzaType[] }) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    items.forEach((item) => {
      const label = item.category?.trim();
      if (label) seen.add(label);
    });
    return ["ALL", ...Array.from(seen).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const [active, setActive] = useState("ALL");

  const visible = useMemo(() => {
    if (active === "ALL") return items;
    return items.filter(
      (item) => (item.category ?? "").trim().toLowerCase() === active.toLowerCase()
    );
  }, [items, active]);

  const selected = categories.includes(active) ? active : "ALL";

  return (
    <>
      <div className="max-w-full overflow-x-auto flex mb-space-xl">
        <div className="mx-auto flex items-center justify-center bg-surface-container-high/10 p-1.5 rounded-full">
          {categories.map((category) => (
            <button
              key={category}
              aria-pressed={selected === category}
              className={
                selected === category
                  ? "px-space-lg py-1.5 rounded-full bg-secondary-container text-on-secondary font-label-md font-bold text-xs uppercase shadow-sm tracking-wider whitespace-nowrap"
                  : "px-space-md py-1.5 rounded-full text-surface-container-high hover:text-surface-container-lowest font-label-md font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
              }
              onClick={() => setActive(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-center py-space-xl text-surface-container-high font-label-md uppercase tracking-wider">
          Nothing in this category right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg text-center">
          {visible.slice(0,8).map((item) => (
            <div key={item._id ?? item.name} className="flex flex-col items-center group">
              <div
                className={`relative w-56 h-56 rounded-full overflow-hidden mb-space-md shadow-2xl transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}
              >
                <Link href={`/menu/${item._id}`}>
                  <Image
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full"
                    fill
                    sizes="224px"
                    src={item.image}
                  />
                </Link>
              </div>
              <Link href={`/menu/${item._id}`}>
                <h3 className="font-title-md font-bold text-surface-container-lowest uppercase tracking-wider text-base">
                  {item.name}
                </h3>
              </Link>
              <Link href={`/menu/${item._id}`}>
                <span className="text-secondary-container font-bold text-headline-sm font-headline-sm mt-3">
                  {item.price} BDT
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
