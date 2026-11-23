"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Root route template: a soft cross-fade on every navigation. Only opacity is
 * animated so sticky headers and dashboard sidebars keep working.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={reduceMotion ? false : { opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
