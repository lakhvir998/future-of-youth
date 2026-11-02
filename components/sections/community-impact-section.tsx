import {
  COMMUNITY_IMPACT_TITLE,
  IMPACT_CATEGORY_TITLES,
  PROGRAM_PROGRESS,
  VERIFIED_METRICS,
  type ImpactCategory,
  type ProgressUpdate,
  type VerifiedMetric,
} from '@/lib/content/community-impact';
import { getProgramBySlug } from '@/lib/content/programs';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}

type CommunityImpactSectionProps = {
  metrics?: readonly VerifiedMetric[];
  progress?: readonly ProgressUpdate[];
};

/**
 * Verified results only. Renders nothing until verified data exists, so the
 * site never shows placeholder or unverified numbers.
 */
export function CommunityImpactSection({
  metrics = VERIFIED_METRICS,
  progress = PROGRAM_PROGRESS,
}: CommunityImpactSectionProps) {
  if (metrics.length === 0 && progress.length === 0) return null;

  const categories = (
    Object.keys(IMPACT_CATEGORY_TITLES) as ImpactCategory[]
  ).filter((category) => metrics.some((m) => m.category === category));

  return (
    <section
      id='community-impact'
      aria-labelledby='community-impact-heading'
      className='bg-surface px-4 py-12 md:py-16'
    >
      <div className='mx-auto max-w-6xl'>
        <h2
          id='community-impact-heading'
          className='text-2xl font-bold text-navy sm:text-3xl'
        >
          {COMMUNITY_IMPACT_TITLE}
        </h2>

        {categories.map((category) => (
          <div key={category} className='mt-8'>
            <h3 className='text-xl font-bold text-navy'>
              {IMPACT_CATEGORY_TITLES[category]}
            </h3>
            <ul className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {metrics
                .filter((m) => m.category === category)
                .map((metric) => (
                  <li
                    key={`${metric.label}-${metric.period}`}
                    className='rounded-xl border-t-4 border-t-brand bg-white p-5 shadow-sm'
                  >
                    <p className='text-3xl font-bold text-navy'>
                      {metric.value}
                    </p>
                    <p className='mt-1 font-semibold text-ink'>
                      {metric.label}
                    </p>
                    <p className='mt-2 text-sm text-gray-700'>
                      {metric.period}
                    </p>
                    <p className='mt-1 text-sm text-gray-700'>
                      Source: {metric.source} · Verified{' '}
                      {formatDate(metric.verifiedOn)}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        {progress.length > 0 && (
          <div className='mt-10'>
            <h3 className='text-xl font-bold text-navy'>Program Progress</h3>
            <ol className='mt-4 space-y-4'>
              {[...progress]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((update) => (
                  <li
                    key={`${update.date}-${update.title}`}
                    className='rounded-xl bg-white p-5 shadow-sm'
                  >
                    <p className='text-sm font-semibold text-gray-700'>
                      <time dateTime={update.date}>
                        {formatDate(update.date)}
                      </time>
                      {' · '}
                      {getProgramBySlug(update.program)?.title ??
                        update.program}
                    </p>
                    <p className='mt-1 font-bold text-navy'>{update.title}</p>
                    <p className='mt-1 text-ink'>{update.description}</p>
                  </li>
                ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
