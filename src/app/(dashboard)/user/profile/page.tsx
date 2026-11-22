import type { Metadata } from "next";

import { ProfileScreen } from "@/components/dashboard/profile/profile-screen";

export const metadata: Metadata = {
  title: "Profile — PizzaHub",
  description:
    "View and update the name, photo and email address on your PizzaHub account.",
};

export default function UserProfile() {
  return <ProfileScreen role="user" />;
}
