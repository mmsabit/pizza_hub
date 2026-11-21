import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MenuManager } from "@/components/dashboard/vendormenu/menu-manager";
import type { PizzaType } from "@/app/type/type";
import { isPremiumActive } from "@/lib/plan";

export const metadata: Metadata = {
  title: "Menu — PizzaHub",
  description:
    "Manage the wood-fired dishes on your PizzaHub storefront and add new pies, sides and drinks.",
};

export default async function MenuPage() {
  const session = await auth.api.getSession({
    headers: await headers() 
})
const user = session?.user

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/${user?.id}`);
const data: PizzaType[] = await res.json();
const premium = isPremiumActive(user);

  return <MenuManager userName={user?.name ?? ""} userImage={user?.image ?? ""} userId={user?.id??""} ITEMS={data} premium={premium} />;
}
