import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth";
import { homeForRole, normalizeRole, type Role } from "@/lib/roles";
import { DashboardSidebar, DashboardMobileNav } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

type DashboardRoleLayoutProps = {
  role: Role;
  children: ReactNode;
};

/**
 * Shared chrome for every dashboard area. Each `layout.tsx` under
 * `(dashboard)` passes the role it belongs to, so the guard and the
 * navigation are decided in exactly one place.
 */
export async function DashboardRoleLayout({
  role,
  children,
}: DashboardRoleLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const userRole = normalizeRole(session.user.role);

  if (userRole !== role) redirect(homeForRole(userRole));

  return (
    <div className="flex min-h-screen bg-dough-surface">
      <DashboardSidebar role={role} user={session.user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar role={role} />
        <DashboardMobileNav role={role} />
        <main className="flex-1 px-margin py-space-lg">{children}</main>
      </div>
    </div>
  );
}
