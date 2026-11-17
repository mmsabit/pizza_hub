/* eslint-disable @next/next/no-img-element */

const SPECIALITIES = [
  {
    name: "MEXICAN GREEN WAVE",
    image: "/images/menu-caesar.jpg",
  },
  {
    name: "DOUBLE CHEESE PIZZA",
    image: "/images/menu-seafood.jpg",
  },
  {
    name: "MARGHERITA PIZZA",
    image: "/images/menu-margherita.jpg",
  },
];

export function SpecialtySection() {
  return (
    <section
      className="w-full py-space-xl bg-surface-container-lowest border-b border-surface-container-high relative overflow-hidden"
      id="featured-specials"
    >
      <div className="absolute top-0 left-0 right-0 w-full pointer-events-none z-10 select-none overflow-hidden leading-none">
        <svg
          className="w-full h-10 sm:h-16 md:h-20 text-secondary-container fill-current object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 L1440,0 L1440,42 C1390,38 1350,56 1280,36 C1220,18 1195,48 1130,40 C1070,32 1045,15 970,38 C910,55 860,25 790,36 C730,46 690,20 620,44 C560,65 520,30 450,42 C390,52 355,22 285,46 C225,66 180,32 110,48 C65,58 35,35 0,44 Z" />
          <circle cx="240" cy="52" r="2.5" />
          <circle cx="270" cy="58" r="1.5" />
          <circle cx="420" cy="55" r="2" />
          <circle cx="630" cy="56" r="2.5" />
          <circle cx="810" cy="48" r="2" />
          <circle cx="1020" cy="54" r="3" />
          <circle cx="1210" cy="50" r="2" />
          <circle cx="1340" cy="56" r="2.5" />
          <path
            d="M140,52 Q150,55 156,53 Q162,51 170,54"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M880,46 Q890,50 900,47"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-margin relative z-20">
        <div className="text-center mb-space-xl">
          <span className="text-secondary-container font-headline-sm italic font-bold tracking-wide block mb-1">
            Fresh From PizzaHub
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-charcoal-dark tracking-wide uppercase">
            OUR SPECIALITY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl max-w-5xl mx-auto text-center items-center justify-center">
          {SPECIALITIES.map((item) => (
            <div key={item.name} className="flex flex-col items-center group">
              <div className="w-56 h-56 rounded-full overflow-hidden shadow-lg mb-space-md bg-dough-surface transition-transform duration-300 group-hover:scale-105">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full"
                  src={item.image}
                />
              </div>
              <h3 className="font-title-md font-bold text-charcoal-dark uppercase tracking-wider text-base">
                {item.name}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-space-xl flex justify-center">
          <a
            className="px-space-xl py-2.5 rounded-full bg-secondary-container hover:bg-crust-gold text-on-secondary font-label-md font-bold text-xs uppercase tracking-widest shadow-md transition-all hover:shadow-lg inline-flex items-center justify-center"
            href="#featured-menu"
          >
            VIEW MORE
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-10 select-none overflow-hidden leading-none">
        <svg
          className="w-full h-10 sm:h-16 md:h-20 text-charcoal-dark fill-current object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,80 L1440,80 L1440,38 C1380,45 1335,22 1270,42 C1210,60 1175,28 1110,40 C1050,52 1010,24 940,44 C880,62 840,30 770,42 C710,52 660,18 590,40 C530,58 495,26 430,36 C370,46 330,16 260,38 C200,56 160,25 90,36 C55,42 25,28 0,38 Z" />
          <circle cx="180" cy="26" r="2" />
          <circle cx="350" cy="22" r="2.5" />
          <circle cx="520" cy="28" r="1.5" />
          <circle cx="720" cy="25" r="3" />
          <circle cx="990" cy="26" r="2" />
          <circle cx="1160" cy="22" r="2.5" />
          <circle cx="1310" cy="28" r="2" />
          <path
            d="M570,24 Q580,20 595,22"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M1040,28 Q1055,24 1070,26"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
