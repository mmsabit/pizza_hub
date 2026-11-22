import { Pizza } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

import { auth } from "@/lib/auth";
import { homeForRole } from "@/lib/roles";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect(homeForRole(session.user.role));
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-charcoal-dark">
      <div className="pointer-events-none absolute -top-40 -left-32 h-120 w-120 rounded-full bg-primary-container/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-128 w-lg rounded-full bg-secondary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-crust-gold/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-margin py-space-md">
          <Link
            aria-label="PizzaHub home"
            className="flex items-center gap-space-sm"
            href="/"
          >
            <Pizza className="text-secondary-container" size={30} strokeWidth={1.75} />
            <span className="font-headline-md text-headline-md font-bold text-surface-container-lowest">
              PizzaHub
            </span>
          </Link>

          <Link
            className="text-label-lg font-label-lg text-surface-container-high/80 hover:text-crust-gold transition-colors"
            href="/"
          >
            Back to home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-margin py-space-lg">
          {children}
        </div>

        <footer className="px-margin pb-space-md text-center font-label-sm text-label-sm text-surface-container-high/50">
          © 2025 PizzaHub Crust Co. • Artisanal Ingredients Verified
        </footer>
      </div>
      <ToastContainer />
    </div>
  );
}
