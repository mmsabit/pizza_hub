import type { ReactNode } from "react";

import { DashboardRoleLayout } from "@/components/dashboard-role-layout";

export default function VendorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardRoleLayout role="vendor">{children}</DashboardRoleLayout>;
}
