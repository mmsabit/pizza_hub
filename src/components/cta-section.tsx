export function CtaSection() {
  return (
    <section className="w-full bg-charcoal-dark text-surface-container-lowest py-space-xl relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin relative z-10">
        <div className="bg-surface-container-high/10 rounded-3xl p-space-lg lg:p-space-xl flex flex-col lg:flex-row items-center justify-between gap-space-xl">
          <div className="space-y-space-sm max-w-xl">
            <span className="text-crust-gold font-label-sm text-label-sm uppercase tracking-widest font-bold">
              PizzaHub VIP Express
            </span>
            <h2 className="font-headline-lg text-headline-lg font-bold">
              Craving Hot Sourdough Right Now?
            </h2>
            <p className="font-body-lg text-body-lg text-surface-dim">
              Order directly from your nearest stone-oven parlor and track your
              delivery rider live from dough stretching to doorstep.
            </p>
            <div className="pt-space-xs flex flex-wrap gap-space-md">
              <a
                className="px-space-lg py-space-md rounded-xl bg-primary-container hover:bg-primary text-on-primary-container font-label-lg text-label-lg font-bold shadow-lg transition-all inline-flex items-center gap-2"
                href="#quick-order"
              >
                <span className="material-symbols-outlined text-lg">
                  local_pizza
                </span>
                <span>Order Hot Pizza Now</span>
              </a>
              <a
                className="px-space-lg py-space-md rounded-xl bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-surface-container-lowest font-label-lg text-label-lg font-bold transition-all inline-flex items-center gap-2"
                href="tel:+18007499248"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span>+1 (800) PIZZA-HUB</span>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-space-md">
            <div className="bg-surface-container-lowest/10 p-space-md rounded-2xl flex items-center gap-space-md w-full sm:w-auto">
              <span className="material-symbols-outlined text-4xl text-secondary-container">
                moped
              </span>
              <div>
                <span className="block font-bold text-surface-container-lowest text-title-md font-title-md">
                  Under 30 Minutes
                </span>
                <span className="text-label-sm font-label-sm text-surface-dim">
                  Guaranteed or $10 coupon
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest/10 p-space-md rounded-2xl flex items-center gap-space-md w-full sm:w-auto">
              <span className="material-symbols-outlined text-4xl text-basil-fresh">
                health_and_safety
              </span>
              <div>
                <span className="block font-bold text-surface-container-lowest text-title-md font-title-md">
                  100% Sealed Fresh
                </span>
                <span className="text-label-sm font-label-sm text-surface-dim">
                  Tamper-evident heat boxes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
