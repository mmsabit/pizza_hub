"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { PizzaType } from "@/app/type/type";
import { EASE, Reveal } from "@/components/animation/motion-primitives";
import Image from "next/image";
import Link from "next/link";

export function MenuGrid({ items }: { items: PizzaType[] }) {
  const reduceMotion = useReducedMotion();
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
      <Reveal className="max-w-full overflow-x-auto flex mb-space-xl">
        <div className="mx-auto flex items-center justify-center bg-surface-container-high/10 p-1.5 rounded-full">
          {categories.map((category) => (
            <motion.button
              key={category}
              aria-pressed={selected === category}
              className={
                selected === category
                  ? "px-space-lg py-1.5 rounded-full bg-secondary-container text-on-secondary font-label-md font-bold text-xs uppercase shadow-sm tracking-wider whitespace-nowrap"
                  : "px-space-md py-1.5 rounded-full text-surface-container-high hover:text-surface-container-lowest font-label-md font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
              }
              onClick={() => setActive(category)}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              type="button"
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </Reveal>

      {visible.length === 0 ? (
        <p className="text-center py-space-xl text-surface-container-high font-label-md uppercase tracking-wider">
          Nothing in this category right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg text-center">
          <AnimatePresence mode="popLayout">
            {visible.slice(0,8).map((item) => (
              <motion.div
                key={item._id ?? item.name}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex flex-col items-center group"
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, scale: 0.94, transition: { duration: 0.2 } }
                }
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
                layout
                transition={{ duration: 0.4, ease: EASE }}
              >
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
