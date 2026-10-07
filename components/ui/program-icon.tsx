import { cn } from '@/lib/cn';

// One decorative icon per program area, shared by the hero badges and the
// program cards so the four areas read as a consistent set.
const PATHS: Record<string, React.ReactNode> = {
  // Lightbulb: turning ideas into businesses.
  entrepreneurship: (
    <path d='M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z' />
  ),
  // Rising chart: building financial stability.
  'financial-literacy': <path d='M4 20h16M6 16l4-4 3 3 6-7M14 8h5v5' />,
  // Chip with an AI sparkle (echoes the logo).
  'ai-technology': (
    <>
      <rect x='6' y='6' width='12' height='12' rx='3' />
      <path d='M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3' />
      <path d='M12 9.2c.3 1.6 1.2 2.5 2.8 2.8-1.6.3-2.5 1.2-2.8 2.8-.3-1.6-1.2-2.5-2.8-2.8 1.6-.3 2.5-1.2 2.8-2.8z' />
    </>
  ),
  // People: leadership and teamwork.
  'career-leadership': (
    <>
      <circle cx='9' cy='8' r='3' />
      <path d='M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6' />
      <circle cx='17' cy='9' r='2.5' />
      <path d='M16 14.2c2.8.3 5 2.6 5 5.8' />
    </>
  ),
};

export function ProgramIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('size-6 shrink-0', className)}
    >
      {PATHS[slug]}
    </svg>
  );
}
