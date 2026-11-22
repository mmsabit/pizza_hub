import { headers } from "next/headers";

import { DashboardNotFound } from "@/components/layout/not-found-screen";
import { auth } from "@/lib/auth";
import { homeForRole, normalizeRole } from "@/lib/roles";

export default async function NotFound() {
  const session = await auth.api.getSession({ headers: await headers() });

  const homeHref = session?.user
    ? homeForRole(normalizeRole(session.user.role))
    : "/sign-in";

  return (
    <DashboardNotFound
      homeHref={homeHref}
      homeLabel={session?.user ? "Back to dashboard" : "Sign in"}
    />
  );
}
