import type { Metadata } from "next";
import { MenuManager } from "@/components/menu-manager";

export const metadata: Metadata = {
  title: "Menu — PizzaHub",
  description:
    "Manage the wood-fired dishes on your PizzaHub storefront and add new pies, sides and drinks.",
};

export default function MenuPage() {
  return <MenuManager />;
}
