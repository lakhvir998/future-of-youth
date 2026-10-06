import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { DonateSection } from '@/components/sections/donate-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { HeroSection } from '@/components/sections/hero-section';
import { MissionSection } from '@/components/sections/mission-section';
import { RequestInfoCtaSection } from '@/components/sections/request-info-cta-section';
import { TestimonialSection } from '@/components/sections/testimonial-section';
import { StructuredData } from '@/components/seo/structured-data';

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main className='min-h-screen w-full bg-surface'>
        <HeroSection />
        <MissionSection />
        <FeaturesSection />
        <TestimonialSection />
        <RequestInfoCtaSection />
        <DonateSection />
      </main>
      <SiteFooter />
    </>
  );
}
