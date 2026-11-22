"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

function useSignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const signOut = async () => {
    if (pending) return;

    setPending(true);

    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return { pending, signOut };
}

/** Full-width logout control for the desktop dashboard sidebar. */
export function DashboardLogoutButton() {
  const { pending, signOut } = useSignOut();

  return (
    <button
      className="mt-space-sm flex w-full items-center justify-center gap-space-xs rounded-xl border border-surface-container-lowest/10 px-space-sm py-space-xs font-label-sm text-label-sm font-bold text-surface-container-high/70 transition-colors hover:border-error/40 hover:bg-error/10 hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      onClick={signOut}
      type="button"
    >
      <LogOut size={14} />
      {pending ? "Logging out…" : "Log out"}
    </button>
  );
}

/** Compact logout control for the mobile dashboard nav. */
export function DashboardMobileLogoutButton() {
  const { pending, signOut } = useSignOut();

  return (
    <button
      aria-label="Log out"
      className="inline-flex shrink-0 items-center gap-space-xs whitespace-nowrap rounded-full px-space-sm py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-error-container hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      onClick={signOut}
      type="button"
    >
      <LogOut size={14} />
      <span className="hidden sm:inline">
        {pending ? "Logging out…" : "Log out"}
      </span>
    </button>
  );
}
