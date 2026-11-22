import { PizzaLoader } from "@/components/layout/pizza-loader";

export default function Loading() {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center bg-dough-canvas"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      }}
      aria-live="polite"
      aria-busy="true"
    >
      <PizzaLoader />
      <p className="mt-2 text-headline-sm text-charcoal-dark">
        Preparing your pizza...
      </p>
    </div>
  );
}
