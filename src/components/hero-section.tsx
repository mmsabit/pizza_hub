/* eslint-disable @next/next/no-img-element */

const HERO_PIZZA_SRC = "/images/hero-pizza.jpg";

const STAR_STYLE = { fontVariationSettings: '"FILL" 1' } as const;

export function HeroSection() {
  return (
    <section className="relative w-full bg-dough-surface overflow-hidden pt-space-xl pb-space-xl">
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin relative z-10 pt-space-md pb-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <div className="lg:col-span-7 space-y-space-md">
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-fixed text-primary font-label-md text-label-md">
              <span className="material-symbols-outlined text-base">
                local_fire_department
              </span>
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
              100% whole-milk mozzarella stone-baked to crisp perfection in under
              30 minutes.
            </p>

            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <a
                className="inline-flex items-center gap-space-xs px-space-lg py-space-md bg-primary-container hover:bg-primary text-on-primary-container font-label-lg text-label-lg rounded-xl shadow-lg shadow-primary-container/25 transition-all transform hover:-translate-y-0.5"
                href="#featured-menu"
              >
                <span>Explore Pizza Menu</span>
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </a>
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
                      <span
                        key={index}
                        className="material-symbols-outlined text-sm"
                        style={STAR_STYLE}
                      >
                        star
                      </span>
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
                <span className="material-symbols-outlined text-tertiary text-lg">
                  verified
                </span>
                <span>100% Organic Sourdough • Zero Trans Fats</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 m-auto w-80 h-80 rounded-full bg-crust-gold/20 filter blur-2xl" />

              <div className="relative z-10 w-full aspect-square rounded-full overflow-hidden shadow-2xl p-2 bg-gradient-to-tr from-secondary-container/40 via-transparent to-primary-container/30">
                <img
                  alt="Steaming artisan Neapolitan wood-fired pizza with bubbling buffalo mozzarella, blistered leopard-spotted crust, fresh basil leaves and rich red tomato sauce on a rustic stone board."
                  className="w-full h-full object-cover rounded-full transform hover:rotate-6 transition-transform duration-700"
                  src={HERO_PIZZA_SRC}
                />
              </div>

              <div className="absolute bottom-6 -left-4 z-20 bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-lg flex items-center gap-space-xs text-charcoal-dark font-label-md text-label-md">
                <span className="material-symbols-outlined text-primary-container text-base">
                  local_fire_department
                </span>
                <span>Wood-fired 450°C Volcano Stone</span>
              </div>

              <div className="absolute -bottom-3 right-0 z-20 bg-charcoal-dark text-on-primary px-space-md py-space-xs rounded-full shadow-xl flex items-center gap-space-xs font-label-md text-label-md">
                <span className="material-symbols-outlined text-crust-gold text-base">
                  electric_moped
                </span>
                <span>30 Min Express Delivery Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
