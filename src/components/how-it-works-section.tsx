const STEPS = [
  {
    icon: "tune",
    iconClassName: "bg-primary-fixed text-primary",
    title: "Select Craft Crust & Toppings",
    description:
      "Pick your dough fermentation style, size, artisanal cheeses, and farm-sourced toppings from local hubs.",
  },
  {
    icon: "outdoor_grill",
    iconClassName: "bg-secondary-fixed text-secondary",
    title: "Stone-Baked In 3 Minutes Flat",
    description:
      "Hand-stretched and baked in authentic 450°C wood-fired ovens creating that signature leopard-spotted crust.",
  },
  {
    icon: "fmd_good",
    iconClassName: "bg-tertiary-fixed text-tertiary",
    title: "Real-Time GPS Thermal Track",
    description:
      "Follow your delivery rider with live temperature sensors ensuring your pie arrives piping hot at 75°C.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-space-xl bg-dough-surface">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="text-center max-w-xl mx-auto mb-space-xl">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm text-center relative flex flex-col items-center"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-space-sm ${step.iconClassName}`}
              >
                <span className="material-symbols-outlined text-3xl">
                  {step.icon}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-charcoal-dark mb-space-xs">
                {step.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
