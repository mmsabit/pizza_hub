import {

  Compass,
  Home,
  Pizza,

  Store,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Float,
  Reveal,
} from "@/components/animation/motion-primitives";

const HERO_PIZZA_SRC = "/images/hero-pizza.jpg";


/**
 * Storefront 404. Rendered by the root and `(site)` not-found boundaries, so
 * it owns no header or footer of its own.
 */
export function SiteNotFound() {
  return (
    <section className="relative overflow-hidden bg-dough-surface">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-secondary-container/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-125 w-125 rounded-full bg-primary-container/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-margin py-space-xl lg:py-20">
        <div className="grid items-center gap-space-xl lg:grid-cols-2">
          <Reveal direction="right">
            <span className="inline-flex items-center gap-space-xs rounded-full bg-primary-fixed px-space-md py-space-xs font-label-md text-label-md text-primary">
              <Compass size={14} />
              Error 404 — Off the menu
            </span>

            <h1 className="mt-space-md font-display-lg text-display-lg-mobile font-extrabold tracking-tight text-charcoal-dark sm:text-display-lg">
              This slice went{" "}
              <span className="text-primary underline decoration-secondary-container decoration-wavy decoration-2">
                missing
              </span>
              .
            </h1>

            <p className="mt-space-sm max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              The page you are looking for has been eaten, moved, or never made
              it out of the oven. Let&apos;s get you back to something
              delicious.
            </p>

            <div className="mt-space-lg flex flex-wrap items-center gap-space-sm">
              <Link
                className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-lg py-space-md font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
                href="/"
              >
                <Home size={18} />
                Back to home
              </Link>
              <Link
                className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-lg py-space-md font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                href="/menu"
              >
                <UtensilsCrossed size={18} />
                Browse the menu
              </Link>
            </div>
          </Reveal>

          <Reveal
            className="relative flex justify-center"
            delay={0.12}
            direction="left"
          >
            <Float className="relative aspect-square w-full max-w-sm" duration={6}>
              <div className="absolute inset-6 rounded-full bg-crust-gold/20 blur-2xl" />

              <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-4 border-surface-container-lowest bg-linear-to-tr from-secondary-container/40 via-transparent to-primary-container/30 shadow-2xl">
                <Image
                  alt="A wood-fired pizza with a slice missing."
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 384px, 80vw"
                  src={HERO_PIZZA_SRC}
                />
              </div>

              <div className="absolute -left-2 top-6 z-20 -rotate-6 rounded-2xl border border-surface-container-high bg-surface-container-lowest px-space-md py-space-sm shadow-lg">
                <p className="font-headline-lg text-headline-lg font-extrabold leading-none text-primary">
                  404
                </p>
                <p className="font-label-sm text-label-sm text-outline">
                  Page not found
                </p>
              </div>

              <div className="absolute -bottom-2 right-0 z-20 flex items-center gap-space-xs rounded-full bg-charcoal-dark px-space-md py-space-sm text-surface-container-lowest shadow-lg">
                <Pizza className="text-secondary-container" size={16} />
                <span className="font-label-sm text-label-sm font-bold">
                  The oven is still hot
                </span>
              </div>
            </Float>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

type DashboardNotFoundProps = {
  homeHref: string;
  homeLabel: string;
};

/** 404 for the role dashboards; the dashboard chrome already surrounds it. */
export function DashboardNotFound({
  homeHref,
  homeLabel,
}: DashboardNotFoundProps) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-space-xl">
      <Reveal
        className="w-full max-w-xl rounded-2xl border border-surface-container-high bg-surface-container-lowest p-space-lg text-center shadow-sm"
        scale={0.96}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          <Pizza size={26} />
        </span>

        <p className="mt-space-md font-label-sm text-label-sm uppercase tracking-[0.2em] text-outline">
          Error 404
        </p>
        <h1 className="mt-space-xs font-headline-lg text-headline-lg-mobile font-bold text-charcoal-dark sm:text-headline-lg">
          This ticket isn&apos;t on the pass.
        </h1>
        <p className="mx-auto mt-space-sm max-w-md font-body-md text-body-md text-on-surface-variant">
          The page you are looking for does not exist, or it belongs to a
          different account. Check the link and try again.
        </p>

        <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-sm">
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl bg-primary-container px-space-lg py-space-md font-label-lg text-label-lg text-on-primary-container shadow-lg shadow-primary-container/25 transition-all hover:-translate-y-0.5 hover:bg-primary"
            href={homeHref}
          >
            <Home size={16} />
            {homeLabel}
          </Link>
          <Link
            className="inline-flex items-center gap-space-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-space-lg py-space-md font-label-lg text-label-lg text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
            href="/"
          >
            <Store size={16} />
            Visit the storefront
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
