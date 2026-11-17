import Image from "next/image";

const CATEGORIES = [
  "ALL",
  "DRINKS",
  "SALADS",
  "PASTA",
  "BURGERS",
  "DESERTS",
  "PIZZAS",
];

const MENU_ITEMS = [
  {
    name: "MARGHERITA PIZZA",
    description:
      "San Marzano tomatoes, buffalo mozzarella, and fresh sweet basil leaves.",
    price: "$20.50",
    image: "/images/menu-margherita.jpg",
    imageClassName: "w-full h-full object-cover rounded-full",
    frameClassName: "",
  },
  {
    name: "RUM WITH SODA",
    description:
      "Handcrafted craft rum served chilled over crushed ice with fresh lime wedges.",
    price: "$20.50",
    image: "/images/menu-rum.jpg",
    imageClassName: "object-contain p-2",
    frameClassName: "bg-surface-container-high/10",
  },
  {
    name: "CAESAR SALAD",
    description:
      "Crisp romaine hearts, toasted sourdough croutons, shaved parmesan cheese.",
    price: "$20.50",
    image: "/images/menu-caesar.jpg",
    imageClassName: "w-full h-full object-cover rounded-full",
    frameClassName: "",
  },
  {
    name: "SEA FOOD PASTA",
    description:
      "Freshly tossed linguine noodles with tiger prawns, calico herbs, and garlic sauce.",
    price: "$20.50",
    image: "/images/menu-seafood.jpg",
    imageClassName: "w-full h-full object-cover rounded-full",
    frameClassName: "",
  },
];

export function MenuSection() {
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
          {MENU_ITEMS.map((item) => (
            <div key={item.name} className="flex flex-col items-center group">
              <div
                className={`relative w-56 h-56 rounded-full overflow-hidden mb-space-md shadow-2xl transition-transform duration-500 group-hover:scale-105 flex items-center justify-center ${item.frameClassName}`}
              >
                <Image
                  alt={item.name}
                  className={item.imageClassName}
                  fill
                  sizes="224px"
                  src={item.image}
                />
              </div>
              <h3 className="font-title-md font-bold text-surface-container-lowest uppercase tracking-wider text-base">
                {item.name}
              </h3>
              <p className="font-body-md text-surface-dim text-xs mt-2 max-w-55 leading-relaxed">
                {item.description}
              </p>
              <span className="text-secondary-container font-bold text-headline-sm font-headline-sm mt-3">
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
