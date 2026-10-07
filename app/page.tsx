import { AiHighlight } from '@/components/sections/ai-highlight';
import { DonateCta } from '@/components/sections/donate-cta';
import { FeaturesSection } from '@/components/sections/features-section';
import { HeroSection } from '@/components/sections/hero-section';
import { ImpactSection } from '@/components/sections/impact-section';
import { MissionVisionSection } from '@/components/sections/mission-vision-section';
import { ProgramsOverview } from '@/components/sections/programs-overview';
import { TestimonialSection } from '@/components/sections/testimonial-section';
import { StructuredData } from '@/components/seo/structured-data';
import { HERO_INTRO } from '@/lib/content/home';
import { PROGRAMS } from '@/lib/content/programs';
import { buildProgramNode } from '@/components/seo/structured-data';
import { buildPageMetadata } from '@/lib/seo';
import { SITE_TITLE } from '@/lib/site';

export const metadata = {
  ...buildPageMetadata('/'),
  // The home page uses the full site title rather than the "%s | Site" template.
  title: { absolute: SITE_TITLE },
};

export default function HomePage() {
  return (
    <>
      <StructuredData
        path='/'
        name={SITE_TITLE}
        description={HERO_INTRO}
        extra={PROGRAMS.map(buildProgramNode)}
      />
      <HeroSection />
      <ProgramsOverview />
      <AiHighlight />
      <MissionVisionSection />
      <FeaturesSection />
      <TestimonialSection />
      <ImpactSection />
      <DonateCta />
    </>
  );
}
