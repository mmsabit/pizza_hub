import type { Metadata } from "next";

import { ProfileScreen } from "@/components/dashboard/profile/profile-screen";

export const metadata: Metadata = {
  title: "Profile — PizzaHub admin",
  description:
    "View and update the name, photo and email address on your PizzaHub admin account.",
};

export default function AdminProfile() {
  return <ProfileScreen role="admin" />;
}
