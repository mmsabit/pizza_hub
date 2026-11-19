import type { ReactNode } from "react";

import { DashboardRoleLayout } from "@/components/dashboard/dashboard-role-layout";
import { ToastContainer } from "react-toastify";

export default function VendorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardRoleLayout role="vendor">{children}
  <ToastContainer />
  </DashboardRoleLayout>;
}
