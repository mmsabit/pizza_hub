import { ArrowRight, BadgeCheck, Flame, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_PIZZA_SRC = "/images/hero-pizza.jpg";

export function HeroSection() {
  return (
    <section className="relative w-full bg-dough-surface overflow-hidden  pb-space-xl">
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-125 h-125 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin relative z-10 pt-space-md pb-space-lg ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center h-[70vh]">
          <div className="lg:col-span-7 space-y-space-md">
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-fixed text-primary font-label-md text-label-md">
              <Flame size={16} />
              <span>Authentic 450°C Wood-Fired Neapolitan Pies</span>
            </div>

            <h1 className="font-display-lg text-display-lg font-extrabold text-charcoal-dark tracking-tight leading-tight">
              Hot &amp; Fresh Pizza <br />
              <span className="text-primary underline decoration-secondary-container decoration-wavy decoration-2">
                Delivered to Your Door
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Handcrafted artisan dough, simmered San Marzano tomato sauce, and
              100% whole-milk mozzarella stone-baked to crisp perfection in
              under 30 minutes.
            </p>

            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <Link
                className="inline-flex items-center gap-space-xs px-space-lg py-space-md bg-primary-container hover:bg-primary text-on-primary-container font-label-lg text-label-lg rounded-xl shadow-lg shadow-primary-container/25 transition-all transform hover:-translate-y-0.5"
                href="/menu"
              >
                <span>Explore Pizza Menu</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="pt-space-md flex flex-wrap items-center gap-space-lg">
              <div className="flex items-center gap-space-sm">
                <div className="flex -space-x-2">
                  <span className="w-9 h-9 rounded-full bg-secondary-container/30 flex items-center justify-center font-bold text-xs text-charcoal-dark">
                    JD
                  </span>
                  <span className="w-9 h-9 rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-xs text-primary">
                    MS
                  </span>
                  <span className="w-9 h-9 rounded-full bg-tertiary-container/20 flex items-center justify-center font-bold text-xs text-tertiary">
                    AL
                  </span>
                </div>
                <div>
                  <div className="flex items-center text-crust-gold">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        fill="currentColor"
                        size={14}
                        strokeWidth={0}
                      />
                    ))}
                    <span className="ml-1 font-bold text-on-surface text-label-sm font-label-sm">
                      4.9/5
                    </span>
                  </div>
                  <span className="text-label-sm font-label-sm text-outline">
                    From 14,200+ foodies
                  </span>
                </div>
              </div>

              <div className="h-8 w-px bg-surface-container-high hidden sm:block" />

              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <BadgeCheck className="text-tertiary" size={18} />
                <span>100% Organic Sourdough • Zero Trans Fats</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 m-auto w-80 h-80 rounded-full bg-crust-gold/20 filter blur-2xl" />

              <div className="relative z-10 w-full aspect-square rounded-full overflow-hidden shadow-2xl bg-linear-to-tr from-secondary-container/40 via-transparent to-primary-container/30">
                <Image
                  alt="Steaming artisan Neapolitan wood-fired pizza with bubbling buffalo mozzarella, blistered leopard-spotted crust, fresh basil leaves and rich red tomato sauce on a rustic stone board."
                  className="object-cover rounded-full p-2 "
                  fill
                  priority
                  sizes="(min-width: 1024px) 448px, 90vw"
                  src={HERO_PIZZA_SRC}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
