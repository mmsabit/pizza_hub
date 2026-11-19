import type { ReactNode } from "react";

import { DashboardRoleLayout } from "@/components/dashboard/dashboard-role-layout";

export default function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardRoleLayout role="user">{children}</DashboardRoleLayout>;
}
