/* eslint-disable @next/next/no-img-element */

const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "Explore Menu", href: "#", active: false },
  { label: "Categories", href: "#", active: false },
  { label: "Combos", href: "#", active: false },
];

const PROFILE_SRC = "/images/avatar.jpg";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dough-surface/95 backdrop-blur-md shadow-[0_4px_20px_rgba(253,157,62,0.08)]">
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-lg">
          <a
            aria-label="PizzaHub home"
            className="flex items-center gap-space-sm"
            data-path="home"
            href="#"
          >
            <span className="material-symbols-outlined text-primary-container text-4xl">
              local_pizza
            </span>
            <span className="font-headline-md text-headline-md font-bold text-charcoal-dark">
              PizzaHub
            </span>
          </a>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-space-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input
              className="w-full pl-10 pr-space-md py-space-sm rounded-full bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container shadow-[0_2px_8px_rgba(253,157,62,0.06)]"
              placeholder="Search wood-fired pies, dips, drinks..."
              type="text"
            />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-space-lg overflow-x-auto py-space-xs">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              aria-current={link.active ? "page" : undefined}
              className={
                link.active
                  ? "whitespace-nowrap transition-colors py-space-xs text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary text-label-lg font-label-lg whitespace-nowrap transition-colors py-space-xs"
              }
              data-path="home"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-space-md">
          <a
            className="flex items-center gap-space-xs bg-primary-container hover:bg-primary text-on-primary-container px-space-md py-space-xs rounded-full shadow-[0_4px_16px_rgba(211,47,47,0.18)] transition-all"
            data-path="cart-and-checkout"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">local_pizza</span>
            <div className="flex items-center gap-space-xs text-label-lg font-label-lg">
              <span>$28.50</span>
              <span className="bg-surface-container-lowest text-primary rounded-full px-space-xs text-label-sm font-label-sm">
                2
              </span>
            </div>
          </a>
          <div className="flex items-center gap-space-xs cursor-pointer">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              src={PROFILE_SRC}
            />
            <span className="material-symbols-outlined text-on-surface-variant hidden sm:inline text-sm">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
