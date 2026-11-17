import { Flame, Gift, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up — PizzaHub",
  description:
    "Create your PizzaHub account for $10 off your first wood-fired order, live delivery tracking and VIP crust rewards.",
};

const PERKS = [
  { icon: Gift, label: "$10 off your first order" },
  { icon: Truck, label: "Free delivery over $25" },
  { icon: Flame, label: "Members-only oven specials" },
];

export default function SignUpPage() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-surface-container-lowest shadow-2xl shadow-black/40">
      <div className="relative h-44 sm:h-52">
        <Image
          alt="Rustic wood-fired pizza fresh from the stone oven"
          className="object-cover"
          fill
          priority
          sizes="(min-width: 672px) 42rem, 100vw"
          src="/images/hero-pizza.jpg"
        />
        <div className="absolute inset-0 bg-linear-to-r from-charcoal-dark via-charcoal-dark/85 to-charcoal-dark/25" />

        <div className="relative z-10 flex h-full flex-col justify-center p-space-lg sm:p-space-xl">
          <span className="inline-flex w-fit items-center gap-space-xs rounded-full bg-crust-gold/15 px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-widest text-crust-gold">
            <Gift size={14} />
            Join the crust club
          </span>
          <h1 className="mt-space-sm font-headline-lg text-headline-lg-mobile text-surface-container-lowest sm:text-headline-lg">
            Create your PizzaHub account
          </h1>
          <p className="mt-space-xs font-body-md text-body-md text-surface-container-high/80">
            Save your favourite crusts, track deliveries live and start
            collecting rewards from your very first pie.
          </p>
        </div>
      </div>

      <div className="p-space-lg sm:p-space-xl">
        <GoogleAuthButton label="Sign up with Google" />

        <div className="my-space-md flex items-center gap-space-sm">
          <span className="h-px flex-1 bg-outline-variant/60" />
          <span className="whitespace-nowrap font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            or sign up with email
          </span>
          <span className="h-px flex-1 bg-outline-variant/60" />
        </div>

        <SignUpForm />

        <div className="my-space-lg h-px w-full bg-outline-variant/50" />

        <p className="font-body-md text-body-md text-on-surface-variant">
          Already have an account?{" "}
          <Link
            className="font-label-lg text-label-lg text-primary hover:text-primary-container transition-colors"
            href="/sign-in"
          >
            Sign in instead
          </Link>
        </p>

        <ul className="mt-space-md flex flex-wrap gap-space-sm">
          {PERKS.map((perk) => (
            <li
              key={perk.label}
              className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-low px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface-variant"
            >
              <perk.icon className="text-secondary" size={14} />
              {perk.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
