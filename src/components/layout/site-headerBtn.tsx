"use client";
import {
  ChevronDown,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_BY_ROLE } from "@/components/dashboard/dashboard-nav";
import { authClient } from "@/lib/auth-client";
import { homeForRole, normalizeRole, roleLabel } from "@/lib/roles";

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
  const role = normalizeRole(user?.role);

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
          <div className="max-h-[80vh] w-64 overflow-y-auto rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-space-sm shadow-xl shadow-charcoal-dark/10">
            <div className="mb-space-xs flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-sm">
              {user.image ? (
                <Image
                  alt={user.name || "Profile"}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                  height={44}
                  src={user.image}
                  width={44}
                />
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                  <User aria-hidden="true" size={20} />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-label-lg text-label-lg font-bold text-charcoal-dark">
                  {user.name || "PizzaHub member"}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {roleLabel(user.role)}
                </p>
              </div>
            </div>
            <nav aria-label="Dashboard navigation" className="space-y-space-xs">
              {NAV_BY_ROLE[role].map((item) => (
                <Link
                  key={item.href}
                  className={MENU_ITEM_CLASS}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="my-space-xs border-t border-surface-container-high" />
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
