import { PizzaLoader } from "@/components/layout/pizza-loader";

export default function Loading() {
  return (
    <main
      className="fixed inset-0 z-9999 flex min-h-screen w-full flex-col items-center justify-center bg-dough-canvas"
      aria-live="polite"
      aria-busy="true"
    >
      <PizzaLoader />
      <p className="mt-2 text-headline-sm text-charcoal-dark">
        Preparing your pizza...
      </p>
    </main>
  );
}
