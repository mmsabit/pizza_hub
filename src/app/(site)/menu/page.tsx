import type { Metadata } from "next";

import type { PizzaType } from "@/app/type/type";
import { MenuBrowser } from "./_comp/menu-browser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu — PizzaHub",
  description:
    "Browse every wood-fired pizza, side, drink and dessert on the PizzaHub menu, filtered by price, category and availability.",
};

export default async function MenuPage() {
  let items: PizzaType[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/available-menu`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) items = data;
    }
  } catch (error) {
    console.error("Failed to load the menu:", error);
  }

  return <MenuBrowser items={items} />;
}
