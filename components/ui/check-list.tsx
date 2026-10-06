import { cn } from '@/lib/cn';

/** Bulleted list with decorative check marks. */
export function CheckList({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className='flex gap-3 text-ink'>
          <svg
            aria-hidden='true'
            className='mt-0.5 size-6 shrink-0 text-brand'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M5 13l4 4L19 7'
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
