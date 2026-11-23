"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/** Shared easing so every reveal in the app feels like one system. */
export const EASE = [0.22, 1, 0.36, 1] as const;

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  aside: motion.aside,
  nav: motion.nav,
  main: motion.main,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  span: motion.span,
  p: motion.p,
} as const;

export type MotionTag = keyof typeof MOTION_TAGS;

type Direction = "up" | "down" | "left" | "right" | "none";

function offsetFor(direction: Direction) {
  switch (direction) {
    case "up":
      return { y: 28 };
    case "down":
      return { y: -24 };
    case "left":
      return { x: 36 };
    case "right":
      return { x: -36 };
    default:
      return {};
  }
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  direction?: Direction;
  delay?: number;
  duration?: number;
  scale?: number;
  once?: boolean;
  amount?: number;
};

/**
 * Fades/slides a block into view the first time it enters the viewport.
 * Use it for page headers, hero copy, images and full sections.
 */
export function Reveal({
  children,
  className,
  as = "div",
  direction = "up",
  delay = 0,
  duration = 0.6,
  scale,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Comp = MOTION_TAGS[as];

  const initial = reduceMotion
    ? false
    : {
        opacity: 0,
        ...offsetFor(direction),
        ...(scale !== undefined ? { scale } : {}),
      };

  return (
    <Comp
      className={className}
      initial={initial}
      transition={{ duration, delay, ease: EASE }}
      viewport={{ once, amount, margin: "0px 0px -60px 0px" }}
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              x: 0,
              y: 0,
              ...(scale !== undefined ? { scale: 1 } : {}),
            }
      }
    >
      {children}
    </Comp>
  );
}

const staggerContainer = (delay: number, stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: { delayChildren: delay, staggerChildren: stagger },
  },
});

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
};

/** Container for a staggered list/grid. Pair with `StaggerItem`. */
export function Stagger({
  children,
  className,
  as = "div",
  delay = 0,
  stagger = 0.08,
  once = true,
  amount = 0.15,
}: StaggerProps) {
  const reduceMotion = useReducedMotion();
  const Comp = MOTION_TAGS[as];

  return (
    <Comp
      className={className}
      initial={reduceMotion ? false : "hidden"}
      variants={staggerContainer(delay, stagger)}
      viewport={{ once, amount }}
      whileInView={reduceMotion ? undefined : "visible"}
    >
      {children}
    </Comp>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  direction?: Direction;
  scale?: number;
  duration?: number;
};

/** One child of a `Stagger` container. */
export function StaggerItem({
  children,
  className,
  as = "div",
  direction = "up",
  scale = 1,
  duration = 0.55,
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const Comp = MOTION_TAGS[as];

  return (
    <Comp
      className={className}
      variants={{
        hidden: reduceMotion
          ? {}
          : { opacity: 0, ...offsetFor(direction), scale },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration, ease: EASE },
        },
      }}
    >
      {children}
    </Comp>
  );
}

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  lift?: number;
  hoverScale?: number;
  as?: MotionTag;
};

/** Card wrapper with a springy hover lift and tap press. */
export function MotionCard({
  children,
  className,
  lift = 6,
  hoverScale = 1.01,
  as = "div",
}: MotionCardProps) {
  const reduceMotion = useReducedMotion();
  const Comp = MOTION_TAGS[as];

  return (
    <Comp
      className={className}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      whileHover={
        reduceMotion ? undefined : { y: -lift, scale: hoverScale }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
    >
      {children}
    </Comp>
  );
}

type FloatProps = {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  rotate?: number;
};

/** Gentle infinite bob for hero images and decorative badges. */
export function Float({
  children,
  className,
  amplitude = 8,
  duration = 5,
  rotate = 0,
}: FloatProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -amplitude, 0],
              rotate: rotate === 0 ? undefined : [0, rotate, 0],
            }
      }
      className={className}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {children}
    </motion.div>
  );
}
