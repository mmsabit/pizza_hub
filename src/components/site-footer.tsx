import { Globe, Leaf, MessageCircle, Navigation, Pizza, ThumbsUp } from "lucide-react";
import Link from "next/link";

const CRUST_MENU = [
  "Classic Margherita",
  "Double Pepperoni Picante",
  "Truffle Wild Mushroom",
  "Burrata Hot Honey",
  "Vegan Herb Pesto",
];

const PIZZERIA_HUBS = [
  "Downtown Brooklyn Parlor",
  "Lower East Side Hub",
  "Williamsburg Oven",
  "Astoria Flagship",
  "Hoboken Kitchen",
];

const SOCIALS = [
  { icon: Globe, label: "Website" },
  { icon: MessageCircle, label: "Chat with us" },
  { icon: ThumbsUp, label: "Like us" },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-charcoal-dark text-surface-container-high pt-space-xl pb-space-lg">
      <div className="max-w-7xl mx-auto px-margin">
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl mb-space-xl">
          <div className="lg:col-span-2 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <Pizza className="text-primary-container" size={24} />
              <span className="font-headline-md text-headline-md font-bold text-surface-container-lowest">
                PizzaHub
              </span>
            </div>
            <p className="font-body-md text-body-md text-surface-dim max-w-sm">
              Artisanal Neapolitan sourdough crusts, hand-stretched with organic
              San Marzano tomatoes, fior di latte mozzarella, and baked at 900°F.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              {SOCIALS.map((social) => (
                <Link
                  key={social.label}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-surface-container-high/10 hover:bg-primary-container hover:text-on-primary-container flex items-center justify-center text-surface-container-lowest transition-colors"
                  href="#"
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-title-md text-title-md font-bold text-surface-container-lowest mb-space-md">
              Our Crust Menu
            </h4>
            <ul className="space-y-space-xs text-body-md font-body-md">
              {CRUST_MENU.map((item) => (
                <li
                  key={item}
                  className="hover:text-crust-gold transition-colors"
                >
                  <Link data-path="explore-menu" href="#">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-title-md text-title-md font-bold text-surface-container-lowest mb-space-md">
              Pizzeria Hubs
            </h4>
            <ul className="space-y-space-xs text-body-md font-body-md">
              {PIZZERIA_HUBS.map((hub) => (
                <li key={hub} className="hover:text-crust-gold transition-colors">
                  <Link data-path="branch-locations" href="#">
                    {hub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-title-md text-title-md font-bold text-surface-container-lowest mb-space-md">
              Express Track
            </h4>
            <div className="space-y-space-sm">
              <p className="font-body-md text-body-md text-surface-dim">
                Waiting on your steaming oven delivery?
              </p>
              <Link
                className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-secondary-container hover:bg-crust-gold text-charcoal-dark font-label-lg text-label-lg transition-colors"
                data-path="delivery-tracking"
                href="#"
              >
                <Navigation size={16} />
                <span>Live Delivery Map</span>
              </Link>
              <div className="pt-space-xs">
                <span className="text-label-sm font-label-sm text-surface-dim block">
                  Direct Kitchen Line:
                </span>
                <span className="text-body-md font-body-md text-secondary-fixed">
                  +1 (800) 749-9248
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between text-surface-dim text-body-md gap-space-md">
          <div className="flex items-center gap-space-xs">
            <Leaf className="text-basil-fresh" size={16} />
            <span>Artisanal Ingredients Verified • Zero Artificial Preservatives</span>
          </div>
          <div className="text-label-sm font-label-sm">
            © 2025 PizzaHub Craft Pizzeria LLC. All rights reserved. Sourdough
            perfection delivered.
          </div>
        </div>
      </div>
    </footer>
  );
}
