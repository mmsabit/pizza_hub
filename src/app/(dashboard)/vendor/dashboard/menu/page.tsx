import type { Metadata } from "next";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MenuManager } from "@/components/dashboard/vendormenu/menu-manager";
import type { PizzaType } from "@/app/type/type";

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
const activeItems = data.filter((item) => item.available).length;

  return <MenuManager userName={user?.name ?? ""} userImage={user?.image ?? ""} userId={user?.id??""} ITEMS={data} activeItems={activeItems} />;
}
