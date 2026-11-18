import { DashboardMobileNav, DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dough-surface">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <DashboardMobileNav />
        <main className="flex-1 px-margin py-space-lg">{children}</main>
      </div>
    </div>
  );
}
