import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { isPremiumActive } from "@/lib/plan";
import type { Role } from "@/lib/roles";
import { ProfileForm } from "./profile-form";

/**
 * Shared profile screen for the user, vendor and admin areas. The route
 * layout has already checked the role; this component only loads the
 * session and hands serializable values to the client form.
 */
export async function ProfileScreen({ role }: { role: Role }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) redirect("/sign-in");

  const plan =
    role === "vendor"
      ? {
          active: isPremiumActive(user),
        }
      : null;

  return (
    <ProfileForm
      plan={plan}
      role={role}
      user={{
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? "",
      }}
    />
  );
}
