import type { ReactNode } from "react";

import { DashboardRoleLayout } from "@/components/dashboard-role-layout";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardRoleLayout role="admin">{children}</DashboardRoleLayout>;
}
