import { BadgeCheck, Bike, Flame } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In — PizzaHub",
  description:
    "Sign in to track live thermal deliveries, reorder your favourite wood-fired pies and unlock VIP crust rewards.",
};

const PERKS = [
  {
    icon: Flame,
    title: "450°C wood-fired ovens",
    description: "Leopard-spotted sourdough crust, baked in three minutes flat.",
  },
  {
    icon: Bike,
    title: "Thermal express delivery",
    description: "Live GPS tracking keeps every pie at 75°C until it reaches you.",
  },
  {
    icon: BadgeCheck,
    title: "VIP crust rewards",
    description: "Earn a free artisanal pie for every ten you devour.",
  },
];

export default function SignInPage() {
  return (
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-surface-container-lowest shadow-2xl shadow-black/40 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-charcoal-dark p-space-xl lg:flex">
        <Image
          alt="Artisan wood-fired pizza fresh from the stone oven"
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 32rem, 0px"
          src="/images/hero-pizza.jpg"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal-dark via-charcoal-dark/85 to-charcoal-dark/40" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-space-xs rounded-full bg-crust-gold/15 px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-widest text-crust-gold">
            <Flame size={14} />
            Stone-fired since 1998
          </span>
          <h2 className="mt-space-md font-headline-lg text-headline-lg text-surface-container-lowest">
            Welcome back to the <span className="text-crust-gold">oven</span>.
          </h2>
          <p className="mt-space-xs font-body-md text-body-md text-surface-container-high/80">
            Sign in to pick up where you left off — saved crusts, saved
            addresses, and a live map of your next delivery.
          </p>
        </div>

        <ul className="relative z-10 mt-space-xl space-y-space-md">
          {PERKS.map((perk) => (
            <li key={perk.title} className="flex items-start gap-space-sm">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest/10 text-crust-gold">
                <perk.icon size={18} />
              </span>
              <div>
                <p className="font-label-lg text-label-lg text-surface-container-lowest">
                  {perk.title}
                </p>
                <p className="font-label-sm text-label-sm text-surface-container-high/70">
                  {perk.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-center p-space-lg sm:p-space-xl">
        <div className="mb-space-md space-y-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-charcoal-dark">
            Sign in
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Use the email tied to your PizzaHub orders.
          </p>
        </div>

        <GoogleAuthButton label="Continue with Google" />

        <div className="my-space-md flex items-center gap-space-sm">
          <span className="h-px flex-1 bg-outline-variant/60" />
          <span className="whitespace-nowrap font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            or sign in with email
          </span>
          <span className="h-px flex-1 bg-outline-variant/60" />
        </div>

        <SignInForm />

        <div className="my-space-lg h-px w-full bg-outline-variant/50" />

        <p className="font-body-md text-body-md text-on-surface-variant">
          New to PizzaHub?{" "}
          <Link
            className="font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors"
            href="/sign-up"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
