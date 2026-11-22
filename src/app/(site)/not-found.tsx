import type { Metadata } from "next";

import { SiteNotFound } from "@/components/layout/not-found-screen";

export const metadata: Metadata = {
  title: "Page not found — PizzaHub",
  description:
    "That page is off the menu. Head back to the PizzaHub storefront and find something fresh from the oven.",
};

export default function NotFound() {
  return <SiteNotFound />;
}
