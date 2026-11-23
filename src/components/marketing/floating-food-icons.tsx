"use client";

import {
  Beer,
  ChefHat,
  Coffee,
  CookingPot,
  CupSoda,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type FloatingIcon = {
  Icon: LucideIcon;
  /** Position percentages keep the icons on the section edges. */
  className: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  tilt: number;
  spin?: boolean;
};

const ICONS: FloatingIcon[] = [
  {
    Icon: Pizza,
    className: "left-[3%] top-[8%]",
    size: 64,
    duration: 9,
    delay: 0,
    drift: 22,
    tilt: 14,
    spin: true,
  },
  {
    Icon: ChefHat,
    className: "right-[6%] top-[10%]",
    size: 56,
    duration: 10,
    delay: 0.6,
    drift: 18,
    tilt: 10,
  },
  {
    Icon: CupSoda,
    className: "left-[6%] top-[48%]",
    size: 48,
    duration: 8,
    delay: 1.1,
    drift: 24,
    tilt: 18,
    spin: true,
  },
  {
    Icon: Beer,
    className: "right-[4%] top-[52%]",
    size: 52,
    duration: 11,
    delay: 0.3,
    drift: 20,
    tilt: 12,
  },
  {
    Icon: UtensilsCrossed,
    className: "left-[14%] bottom-[12%]",
    size: 44,
    duration: 9.5,
    delay: 1.4,
    drift: 16,
    tilt: 16,
  },
  {
    Icon: CookingPot,
    className: "left-[30%] top-[2%]",
    size: 46,
    duration: 12,
    delay: 0.9,
    drift: 14,
    tilt: 8,
    spin: true,
  },
  {
    Icon: Soup,
    className: "right-[30%] top-[4%]",
    size: 42,
    duration: 10.5,
    delay: 1.8,
    drift: 18,
    tilt: 12,
  },
  {
    Icon: Coffee,
    className: "right-[16%] bottom-[14%]",
    size: 40,
    duration: 8.5,
    delay: 0.4,
    drift: 20,
    tilt: 14,
    spin: true,
  },
  {
    Icon: Sandwich,
    className: "left-[42%] bottom-[4%]",
    size: 42,
    duration: 11.5,
    delay: 2.1,
    drift: 15,
    tilt: 10,
  },
  {
    Icon: Salad,
    className: "right-[40%] bottom-[8%]",
    size: 38,
    duration: 9,
    delay: 1.6,
    drift: 17,
    tilt: 12,
  },
];

const LIGHT_TINTS = [
  "text-primary/15",
  "text-charcoal-dark/10",
  "text-crust-gold/30",
  "text-secondary/25",
  "text-basil-fresh/25",
  "text-charcoal-dark/8",
  "text-primary/12",
  "text-crust-gold/30",
  "text-secondary/20",
  "text-basil-fresh/20",
];

const DARK_TINTS = [
  "text-primary/25",
  "text-crust-gold/30",
  "text-secondary-container/25",
  "text-basil-fresh/25",
  "text-surface-container-lowest/15",
  "text-crust-gold/20",
  "text-primary/20",
  "text-secondary-container/20",
  "text-basil-fresh/20",
  "text-surface-container-lowest/12",
];

type FloatingFoodIconsProps = {
  /** Limit how many icons render; useful for shorter sections. */
  count?: number;
  /** Rotate the icon order so neighbouring sections do not repeat the same set. */
  offset?: number;
  /** Use the brighter tint set on charcoal/dark backgrounds. */
  dark?: boolean;
};

/**
 * Ambient pizza-shop icons that bob, drift and slowly spin behind a section.
 * Purely decorative: hidden from assistive tech and disabled when the visitor
 * asks for reduced motion. The parent needs `relative overflow-hidden`.
 */
export function FloatingFoodIcons({
  count = ICONS.length,
  offset = 0,
  dark = false,
}: FloatingFoodIconsProps) {
  const reduceMotion = useReducedMotion();
  const tints = dark ? DARK_TINTS : LIGHT_TINTS;
  const icons = Array.from(
    { length: Math.min(count, ICONS.length) },
    (_, index) => ICONS[(index + offset) % ICONS.length],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      {icons.map(
        (
          { Icon, className, size, duration, delay, drift, tilt, spin },
          index,
        ) => (
          <motion.div
            key={`${Icon.displayName ?? "icon"}-${index}`}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -drift, 0, drift * 0.4, 0],
                    x: [0, tilt * 0.6, 0, -tilt * 0.4, 0],
                    rotate: spin ? 360 : [0, tilt, 0, -tilt * 0.5, 0],
                  }
            }
            className={`absolute ${className} ${tints[index]}`}
            transition={{
              duration,
              delay,
              ease: spin ? "linear" : "easeInOut",
              repeat: Infinity,
              repeatType: spin ? "loop" : "mirror",
            }}
          >
            <Icon size={size} strokeWidth={1.15} />
          </motion.div>
        ),
      )}
    </div>
  );
}
