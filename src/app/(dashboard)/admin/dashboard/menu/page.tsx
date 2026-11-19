import { AdminMenuManager } from "@/components/dashboard/adminmenu/admin-menu-manager";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Menu — PizzaHub",
  description:
    "Manage the wood-fired dishes on your PizzaHub storefront and add new pies, sides and drinks.",
};

export default async function MenuPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adminmenu`);
  const menu = await res.json();

  return <AdminMenuManager ITEMS={menu} />;
}
