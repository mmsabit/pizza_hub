import { Flame, MapPin, SlidersHorizontal } from "lucide-react";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";
import { FloatingFoodIcons } from "./floating-food-icons";

const STEPS = [
  {
    icon: SlidersHorizontal,
    iconClassName: "bg-primary-fixed text-primary",
    title: "Select Craft Crust & Toppings",
    description:
      "Pick your dough fermentation style, size, artisanal cheeses, and farm-sourced toppings from local hubs.",
  },
  {
    icon: Flame,
    iconClassName: "bg-secondary-fixed text-secondary",
    title: "Stone-Baked In 3 Minutes Flat",
    description:
      "Hand-stretched and baked in authentic 450°C wood-fired ovens creating that signature leopard-spotted crust.",
  },
  {
    icon: MapPin,
    iconClassName: "bg-tertiary-fixed text-tertiary",
    title: "Real-Time GPS Thermal Track",
    description:
      "Follow your delivery rider with live temperature sensors ensuring your pie arrives piping hot at 75°C.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative w-full overflow-hidden py-space-xl bg-dough-surface">
      <FloatingFoodIcons count={5} offset={6} />

      <div className="relative z-10 max-w-7xl mx-auto px-margin py-20">
        <Reveal className="text-center max-w-xl mx-auto mb-space-xl">
          <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
            Fast • Artisanal • Seamless
          </span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-charcoal-dark mt-1">
            How PizzaHub Works
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            From artisanal preparation to your dining table in 3 straightforward
            steps.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
          {STEPS.map((step) => (
            <StaggerItem key={step.title}>
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm text-center relative flex flex-col items-center h-full transition-shadow hover:shadow-xl">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-space-sm ${step.iconClassName}`}
                >
                  <step.icon size={30} />
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-charcoal-dark mb-space-xs">
                  {step.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
