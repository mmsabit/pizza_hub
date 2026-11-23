import { Flame, Gift, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";

export const metadata: Metadata = {
  title: "Sign Up — PizzaHub",
  description:
    "Create your PizzaHub account for $10 off your first wood-fired order, live delivery tracking and VIP crust rewards.",
};

const PERKS = [
  {
    icon: Gift,
    title: "$10 off your first order",
    description: "A welcome credit lands in your account the moment you join.",
  },
  {
    icon: Truck,
    title: "Free delivery over $25",
    description: "Every basket above $25 ships free across all boroughs.",
  },
  {
    icon: Flame,
    title: "Members-only oven specials",
    description: "Early access to seasonal pies and stone-oven experiments.",
  },
];

export default function SignUpPage() {
  return (
    <Reveal
      className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-surface-container-lowest shadow-2xl shadow-black/40 lg:grid-cols-2"
      duration={0.5}
      scale={0.97}
    >
      <Reveal
        className="relative hidden flex-col justify-between overflow-hidden bg-charcoal-dark p-space-xl lg:flex"
        direction="right"
      >
        <Image
          alt="Rustic wood-fired pizza fresh from the stone oven"
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 32rem, 0px"
          src="/images/hero-pizza.jpg"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal-dark via-charcoal-dark/85 to-charcoal-dark/40" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-space-xs rounded-full bg-crust-gold/15 px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-widest text-crust-gold">
            <Gift size={14} />
            Join the crust club
          </span>
          <h2 className="mt-space-md font-headline-lg text-headline-lg text-surface-container-lowest">
            Your first pie is <span className="text-crust-gold">on us</span>.
          </h2>
          <p className="mt-space-xs font-body-md text-body-md text-surface-container-high/80">
            Create an account to save your favourite crusts, track deliveries
            live and turn every order into rewards.
          </p>
        </div>

        <Stagger as="ul" className="relative z-10 mt-space-xl space-y-space-md">
          {PERKS.map((perk) => (
            <StaggerItem as="li" className="flex items-start gap-space-sm" key={perk.title}>
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
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>

      <Reveal
        className="flex flex-col justify-center p-space-lg sm:p-space-xl"
        delay={0.12}
        direction="left"
      >
        <div className="mb-space-md space-y-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-charcoal-dark">
            Create your account
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Join 40,000+ crust lovers ordering from the oven.
          </p>
        </div>

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
      </Reveal>
    </Reveal>
  );
}
