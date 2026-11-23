import { Pizza } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { roleLabel, type Role, type RoleUser } from "@/lib/roles";
import { Reveal } from "@/components/animation/motion-primitives";
import { DashboardLogoutButton } from "./dashboard-logout-button";
import { DashboardSidebarNav } from "./dashboard-nav";

export { DashboardMobileNav } from "./dashboard-nav";

const PROFILE_SRC = "/images/placeholder.png";

type DashboardSidebarProps = {
  role: Role;
  user?: RoleUser | null;
};

export function DashboardSidebar({ role, user }: DashboardSidebarProps) {
  const name = user?.name || "PizzaHub member";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-charcoal-dark px-space-md py-space-lg lg:flex">
      <Reveal className="mb-space-xl" direction="right">
        <Link
          aria-label="PizzaHub home"
          className="flex items-center gap-space-sm px-space-xs"
          href="/"
        >
          <Pizza className="text-secondary-container" size={30} strokeWidth={1.75} />
          <span className="font-headline-md text-headline-md font-bold text-surface-container-lowest">
            PizzaHub
          </span>
        </Link>
      </Reveal>

      <DashboardSidebarNav role={role} />

      <Reveal
        className="mt-space-lg rounded-2xl bg-surface-container-lowest/5 p-space-sm"
        delay={0.2}
        direction="up"
      >
        <div className="flex items-center gap-space-sm">
          <Image
            alt={name}
            className="h-9 w-9 rounded-full object-cover"
            height={36}
            src={user?.image || PROFILE_SRC}
            width={36}
          />
          <div className="min-w-0">
            <p className="truncate font-label-lg text-label-lg text-surface-container-lowest">
              {name}
            </p>
            <p className="truncate font-label-sm text-label-sm text-surface-container-high/60">
              {roleLabel(user?.role)}
            </p>
          </div>
        </div>

        <DashboardLogoutButton />
      </Reveal>
    </aside>
  );
}
