import { CtaSection } from "@/components/cta-section";
import { HeroSection } from "@/components/hero-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { MenuSection } from "@/components/menu-section";
import { SpecialtySection } from "@/components/specialty-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { WhyChooseSection } from "@/components/why-choose-section";

export default function Home() {
  return (
    <>    
        <div className="flex flex-col w-full">
          <HeroSection />
          <SpecialtySection />
          <MenuSection />
          <HowItWorksSection />
          <WhyChooseSection />
          <TestimonialsSection />
          <CtaSection />
        </div> 
    </>
  );
}
