import { CtaSection } from "@/components/marketing/cta-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { MenuSection } from "@/components/marketing/menu-section";
import { SpecialtySection } from "@/components/marketing/specialty-section";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { WhyChooseSection } from "@/components/marketing/why-choose-section";

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
