"use client";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { homeForRole } from "@/lib/roles";

const MENU_ITEM_CLASS =
  "flex w-full items-center gap-space-xs rounded-xl px-space-sm py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container";

const SiteHeaderBtn = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = session?.user;
  const dashboardHref = homeForRole(user?.role);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      setOpen(false);
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  if (user) {
    return (
      <div
        className="relative"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setOpen(false);
        }}
        ref={menuRef}
      >
        <div className="flex items-center gap-space-xs rounded-full py-space-xs pl-space-xs pr-space-xs transition-colors hover:bg-surface-container-low sm:pr-space-sm">
          <Link aria-label="Open dashboard" className="flex items-center" href={dashboardHref}>
            {user.image ? (
              <Image
                alt="Profile"
                className={`h-8 w-8 rounded-full object-cover ring-2 transition-all ${
                  open ? "ring-primary-container/40" : "ring-transparent"
                }`}
                height={32}
                src={user.image}
                width={32}
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-label-md text-on-primary-container"
              >
                <User aria-hidden="true" size={16} />
              </span>
            )}
          </Link>

          <button
            aria-controls="profile-menu"
            aria-expanded={open}
            aria-label="Account menu"
            className="flex items-center text-on-surface-variant transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
            onClick={() => setOpen((visible) => !visible)}
            type="button"
          >
            <ChevronDown
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              size={14}
            />
          </button>
        </div>

        <div
          className={`absolute right-0 top-full z-50 pt-space-xs transition-all duration-150 ${
            open ? "visible opacity-100" : "invisible opacity-0"
          }`}
          id="profile-menu"
        >
          <div
            aria-label="Account"
            className="w-52 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-space-xs shadow-xl shadow-charcoal-dark/10"
          >
            <Link
              className={MENU_ITEM_CLASS}
              href={dashboardHref}
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <button
              className={`${MENU_ITEM_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
              disabled={signingOut}
              onClick={handleSignOut}
              type="button"
            >
              <LogOut size={16} />
              {signingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-space-xs">
        <Link
          aria-label="Sign in"
          className="inline-flex items-center gap-space-xs whitespace-nowrap rounded-full bg-primary-container px-space-xs py-space-xs font-label-md text-label-md text-on-primary-container shadow-[0_4px_16px_rgba(211,47,47,0.18)] transition-all hover:bg-primary sm:px-space-sm"
          href="/sign-in"
        >
          <LogIn size={14} />
          <span className="hidden xl:inline">Sign In</span>
        </Link>
        <Link
          aria-label="Sign up"
          className="inline-flex items-center gap-space-xs whitespace-nowrap rounded-full border border-outline-variant px-space-xs py-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:border-primary hover:text-primary sm:px-space-sm"
          href="/sign-up"
        >
          <UserPlus size={14} />
          <span className="hidden xl:inline">Sign Up</span>
        </Link>
      </div>
    );
  }
};

export default SiteHeaderBtn;
