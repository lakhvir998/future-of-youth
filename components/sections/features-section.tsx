import Image from 'next/image';

import { FeatureRow } from './feature-row';

type FeatureVideoProps = {
  src: string;
  /** id of the visible heading that names this video. */
  labelledBy: string;
  /**
   * WebVTT captions, required by WCAG 1.2.2 because the videos have audio.
   * Drop the .vtt file in public/captions/ and pass its path here.
   */
  captionsSrc?: string;
};

function FeatureVideo({ src, labelledBy, captionsSrc }: FeatureVideoProps) {
  return (
    <video
      src={src}
      controls
      preload='metadata'
      playsInline
      aria-labelledby={labelledBy}
      className='h-80 w-full rounded-2xl object-cover'
    >
      {captionsSrc && (
        <track
          kind='captions'
          src={captionsSrc}
          srcLang='en'
          label='English'
          default
        />
      )}
      Your browser does not support the video tag.
    </video>
  );
}

export function FeaturesSection() {
  return (
    <section className='relative w-full overflow-hidden bg-white px-4 py-10 md:py-20'>
      <div
        aria-hidden='true'
        className='absolute -top-16 -left-16 z-0 size-64 rounded-full bg-accent opacity-30 blur-2xl'
      />

      <FeatureRow
        headingId='engage-youth-heading'
        title='Engage Youth'
        titleClassName='text-brand'
        media={
          <FeatureVideo src='/video1.mp4' labelledBy='engage-youth-heading' />
        }
      >
        <p>
          By addressing educational gaps and providing personalized support, we
          aim to close the achievement divide and ensure that minority students
          in our community have the tools they need to thrive academically and
          beyond. Our program is not just about homework help—it’s about
          fostering resilience, promoting equity, and building brighter futures.
        </p>
      </FeatureRow>

      <FeatureRow
        headingId='individualized-learning-heading'
        title='Individualized Learning Builds Empowerment'
        titleClassName='text-navy'
        media={
          <FeatureVideo
            src='/video2.mp4'
            labelledBy='individualized-learning-heading'
          />
        }
        reverse
      >
        <p>
          In addition to academic support, our program emphasizes the importance
          of life skills and overall well-being. We provide financial literacy
          education to equip students with the knowledge and tools they need to
          make informed decisions about money management, saving, and building a
          secure future. By introducing these concepts early, we empower young
          people—especially those from minority communities—to break cycles of
          financial hardship and create generational stability.
        </p>
        <p>
          To ensure every child can focus and thrive, we also serve free,
          nutritious lunches during all sessions. By supporting both learning
          and wellness, we’re closing the achievement gap and creating brighter
          futures for our community.
        </p>
      </FeatureRow>

      <FeatureRow
        headingId='flexible-approaches-heading'
        title='Flexible Approaches for Bright Minds'
        titleClassName='text-accent-strong'
        media={
          <Image
            src='/image_3.jpeg'
            alt='Students working together during a program session'
            width={600}
            height={800}
            sizes='(min-width: 768px) 50vw, 100vw'
            className='h-130 w-full object-cover'
          />
        }
      >
        <p>
          We are deeply grateful for the support of our community, volunteers,
          and partners who make this work possible. Every tutoring session,
          every shared meal, and every moment of encouragement helps create
          lasting change. Together, we are not just building stronger
          students—we are building brighter futures.
        </p>
      </FeatureRow>

      <div
        aria-hidden='true'
        className='absolute -right-16 -bottom-16 z-0 size-64 rounded-full bg-brand opacity-20 blur-2xl'
      />
    </section>
  );
}
