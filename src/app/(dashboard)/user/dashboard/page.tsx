import { redirect } from "next/navigation";

export default function UserDashboardPage() {
  // `/dashboard` is the customer home; keep this URL as an alias.
  redirect("/dashboard");
}
