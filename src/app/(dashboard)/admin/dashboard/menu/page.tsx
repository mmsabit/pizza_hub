import { AdminMenuManager } from "@/components/dashboard/adminmenu/admin-menu-manager";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";


export const metadata: Metadata = {
  title: "Menu — PizzaHub",
  description:
    "Manage the wood-fired dishes on your PizzaHub storefront and add new pies, sides and drinks.",
};

export default async function MenuPage() {
  const jwtToken = await auth.api.getToken({ headers: await headers() });
  const token = jwtToken.token;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adminmenu`,{
    headers:{
      authorization: `Bearer ${token}`
    }
  });

  const payload: unknown = await res.json();
  const menu = res.ok && Array.isArray(payload) ? payload : [];

  return <AdminMenuManager ITEMS={menu} />;
}
