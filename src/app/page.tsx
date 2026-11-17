import { CtaSection } from "@/components/cta-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { MenuSection } from "@/components/menu-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SpecialtySection } from "@/components/specialty-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { WhyChooseSection } from "@/components/why-choose-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="w-full bg-dough-canvas pt-space-xl">
        <div className="flex flex-col w-full">
          <HeroSection />
          <SpecialtySection />
          <MenuSection />
          <HowItWorksSection />
          <WhyChooseSection />
          <TestimonialsSection />
          <CtaSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
