import { Medal, Timer, Tractor, Upload, Wheat } from "lucide-react";
import Image from "next/image";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";

const OVEN_IMAGE_SRC = "/images/oven.jpg";

const PILLARS = [
  {
    icon: Wheat,
    iconClassName: "bg-primary-fixed text-primary",
    title: "Authentic Slow-Fermented Dough",
    description:
      "48-hour cold fermentation process for maximum digestibility, airy crust, and crispy honeycomb texture.",
  },
  {
    icon: Tractor,
    iconClassName: "bg-tertiary-fixed text-tertiary",
    title: "Farm-to-Oven Fresh Ingredients",
    description:
      "D.O.P San Marzano tomatoes, local pasture-raised dairy, and authentic imported Italian cured meats.",
  },
  {
    icon: Upload,
    iconClassName: "bg-secondary-fixed text-secondary",
    title: "30-Min Heat-Insulated Express",
    description:
      "Custom thermal chamber backpacks ensuring your pie arrives at scorching 75°C oven temperature.",
  },
  {
    icon: Medal,
    iconClassName: "bg-crust-gold/20 text-charcoal-dark",
    title: "Master Artisan Pizzaiolos",
    description:
      "Certified regional pizzaiolos hand-stretching every pie on volcanic stone decks with real firewood.",
  },
];

const METRICS = [
  { value: "99.8%", label: "On-Time Delivery", valueClassName: "text-primary" },
  {
    value: "50k+",
    label: "Monthly Happy Foodies",
    valueClassName: "text-secondary",
  },
  {
    value: "450°C",
    label: "Stone Deck Baking",
    valueClassName: "text-crust-gold",
  },
  {
    value: "100%",
    label: "Natural Fresh Produce",
    valueClassName: "text-tertiary",
  },
];

export function WhyChooseSection() {
  return (
    <section className="w-full py-space-xl bg-dough-canvas">
      <div className="max-w-7xl mx-auto px-margin py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <Reveal className="lg:col-span-5 relative" direction="right">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative h-120">
              <Image
                alt="Pizzaiolo in a white apron sliding an artisanal dough pizza on a long wooden peel into a blazing brick wood-fired dome oven glowing with yellow and red embers."
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                src={OVEN_IMAGE_SRC}
              />
              <div className="absolute inset-0 bg-linear-to-t from-charcoal-dark/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-on-primary">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-crust-gold font-bold">
                  The Heritage Kitchen
                </span>
                <h4 className="font-headline-sm text-headline-sm font-bold text-surface-container-lowest">
                  Volcanic Stone Deck Baking at 450°C
                </h4>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 bg-surface-container-lowest rounded-2xl p-space-md shadow-xl max-w-52.5 hidden sm:block">
              <div className="flex items-center gap-space-xs text-primary font-headline-md text-headline-md font-bold">
                <Timer size={24} />
                <span>48 Hours</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Cold Sourdough Fermentation for Crisp &amp; Light Crust
              </span>
            </div>
          </Reveal>

          <Reveal
            className="lg:col-span-7 space-y-space-lg"
            delay={0.1}
            direction="left"
          >
            <div>
              <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
                The Neapolitan Standard
              </span>
              <h2 className="font-headline-lg text-headline-lg font-extrabold text-charcoal-dark mt-1">
                Why Choose PizzaHub?
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                We reject frozen industrial commissary dough. Every PizzaHub
                partner oven upholds strict Neapolitan culinary principles with
                uncompromising ingredient integrity.
              </p>
            </div>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {PILLARS.map((pillar) => (
                <StaggerItem key={pillar.title}>
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm transition-shadow hover:shadow-lg">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-space-xs ${pillar.iconClassName}`}
                    >
                      <pillar.icon size={20} />
                    </div>
                    <h3 className="font-title-md text-title-md font-bold text-charcoal-dark">
                      {pillar.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      {pillar.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Stagger
              className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs"
              stagger={0.06}
            >
              {METRICS.map((metric) => (
                <StaggerItem key={metric.label} scale={0.92}>
                  <div className="bg-surface-container-low rounded-xl p-space-sm text-center">
                    <span
                      className={`font-headline-md text-headline-md font-extrabold block ${metric.valueClassName}`}
                    >
                      {metric.value}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {metric.label}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
