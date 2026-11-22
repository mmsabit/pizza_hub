import type { Metadata } from "next";

import { ProfileScreen } from "@/components/dashboard/profile/profile-screen";

export const metadata: Metadata = {
  title: "Store profile — PizzaHub",
  description:
    "Manage your PizzaHub vendor profile and see the plan your storefront is on.",
};

export default function VendorProfile() {
  return <ProfileScreen role="vendor" />;
}
