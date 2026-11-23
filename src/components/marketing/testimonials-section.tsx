import { BadgeCheck, Star } from "lucide-react";

import {
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/animation/motion-primitives";

const REVIEWS = [
  {
    quote:
      "The Godfather Truffle Pepperoni is absolute sorcery. That honeycomb sourdough crust has actual leopard spots and the pie was still steaming hot when the courier arrived at 24 minutes!",
    initials: "EL",
    avatarClassName: "bg-primary-container text-on-primary-container",
    name: "Elena Lorenzo",
    meta: "Brooklyn, NY • Ordered 8 times",
  },
  {
    quote:
      "Finally, a delivery app that doesn't deliver soggy pizza! You can tell they use genuine Buffalo mozzarella and the San Marzano tomato sauce is remarkably sweet without acidic bite.",
    initials: "MR",
    avatarClassName: "bg-secondary-container text-charcoal-dark",
    name: "Marcus Rodriguez",
    meta: "Manhattan, NY • Food Blogger",
  },
  {
    quote:
      "We ordered the Family Feast Combo for Friday game night. The 48-hour fermented dough didn't leave anyone feeling weighed down. Even the garlic knots tasted like heaven.",
    initials: "SC",
    avatarClassName: "bg-tertiary-container text-on-tertiary-container",
    name: "Sarah Chen",
    meta: "Queens, NY • Regular Customer",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full py-space-xl bg-dough-surface">
      <div className="max-w-7xl mx-auto px-margin py-20">
        <Reveal className="text-center max-w-xl mx-auto mb-space-lg">
          <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
            Pizza Addict Praise
          </span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-charcoal-dark mt-1">
            Loved By 14,200+ Verified Buyers
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            See what real diners in Brooklyn, Manhattan, and Queens say about our
            wood-fired pies.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {REVIEWS.map((review) => (
            <StaggerItem key={review.name}>
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between h-full transition-shadow hover:shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="flex text-crust-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        fill="currentColor"
                        size={16}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-label-sm text-label-sm font-bold flex items-center gap-1">
                    <BadgeCheck size={12} />
                    <span>Verified Order</span>
                  </span>
                </div>
                <p className="font-body-md text-body-md text-charcoal-dark italic">
                  &quot;{review.quote}&quot;
                </p>
              </div>

              <div className="flex items-center gap-space-sm pt-space-md mt-space-sm">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${review.avatarClassName}`}
                >
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-title-md text-title-md font-bold text-charcoal-dark leading-tight">
                    {review.name}
                  </h4>
                  <span className="font-label-sm text-label-sm text-outline">
                    {review.meta}
                  </span>
                </div>
              </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
