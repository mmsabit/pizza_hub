import type { Metadata } from "next";
import { MenuManager } from "@/components/menu-manager";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
  return <MenuManager userName={user?.name ?? ""} userImage={user?.image ?? ""} userId={user?.id??""}/>;
}
