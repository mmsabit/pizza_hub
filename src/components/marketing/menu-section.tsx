import { PizzaType } from "@/app/type/type";
import { Reveal } from "@/components/animation/motion-primitives";
import { MenuGrid } from "./menu-grid";

export async function MenuSection() {
  let menu: PizzaType[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/available-menu`);
    const data = await res.json();
    if (res.ok && Array.isArray(data)) menu = data;
  } catch {
    menu = [];
  }
  return (
    <section
      className="w-full py-space-xl bg-charcoal-dark text-surface-container-lowest"
      id="featured-menu"
    >
      <div className="max-w-7xl mx-auto px-margin py-20">
        <Reveal className="text-center max-w-2xl mx-auto mb-space-xl">
          <span className="text-secondary-container font-bold text-headline-sm italic tracking-wide block mb-1">
            Fresh From PizzaHub
          </span>
          <h2 className="font-headline-lg text-4xl sm:text-5xl font-extrabold text-surface-container-lowest tracking-tight uppercase">
            OUR SPECIAL MENU
          </h2>
        </Reveal>

        <MenuGrid items={menu} />
      </div>
    </section>
  );
}
