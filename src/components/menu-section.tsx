import { PizzaType } from "@/app/type/type";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  "ALL",
  "DRINKS",
  "SALADS",
  "PASTA",
  "BURGERS",
  "DESERTS",
  "PIZZAS",
];



export async function MenuSection() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/available-menu`);
  const menu = await res.json();
  return (
    <section
      className="w-full py-space-xl bg-charcoal-dark text-surface-container-lowest"
      id="featured-menu"
    >
      <div className="max-w-7xl mx-auto px-margin py-20">
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <span className="text-secondary-container font-bold text-headline-sm italic tracking-wide block mb-1">
            Fresh From PizzaHub
          </span>
          <h2 className="font-headline-lg text-4xl sm:text-5xl font-extrabold text-surface-container-lowest tracking-tight uppercase">
            OUR SPECIAL MENU
          </h2>
          <div className="mt-space-lg max-w-full overflow-x-auto flex">
            <div className="mx-auto flex items-center justify-center bg-surface-container-high/10 p-1.5 rounded-full">
              {CATEGORIES.map((category, index) => (
                <button
                  key={category}
                  className={
                    index === 0
                      ? "px-space-lg py-1.5 rounded-full bg-secondary-container text-on-secondary font-label-md font-bold text-xs uppercase shadow-sm tracking-wider"
                      : "px-space-md py-1.5 rounded-full text-surface-container-high hover:text-surface-container-lowest font-label-md font-bold text-xs uppercase tracking-wider transition-colors"
                  }
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg text-center">
          {menu.map((item:PizzaType) => (
            <div key={item.name} className="flex flex-col items-center group">
              <div
                className={`relative w-56 h-56 rounded-full overflow-hidden mb-space-md shadow-2xl transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}
              >
               <Link href={`/menu/${item._id}`}> 
               <Image
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full"
                  fill
                  sizes="224px"
                  src={item.image}
                />
                </Link>
              </div>
              <Link href={`/menu/${item._id}`}>
              <h3 className="font-title-md font-bold text-surface-container-lowest uppercase tracking-wider text-base">
                {item.name}
              </h3>
              </Link>
              <Link href={`/menu/${item._id}`}>
              <span className="text-secondary-container font-bold text-headline-sm font-headline-sm mt-3">
                {item.price} BDT
              </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
