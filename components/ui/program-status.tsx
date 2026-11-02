import { cn } from '@/lib/cn';
import {
  PROGRAM_AGES,
  PROGRAM_STATUS_LABEL,
  type ProgramStatus,
} from '@/lib/content/programs';

const STATUS_CLASSES: Record<ProgramStatus, string> = {
  // Both pairs are above 7:1 contrast.
  operating: 'bg-green-100 text-green-900',
  planned: 'bg-amber-100 text-amber-900',
};

/** "Grades 2–12 · Operating now": who it's for and whether it's running today. */
export function ProgramStatusBadges({
  status,
  className,
}: {
  status: ProgramStatus;
  className?: string;
}) {
  return (
    <ul
      aria-label='Program details'
      className={cn('flex flex-wrap gap-2 text-sm font-semibold', className)}
    >
      <li className={cn('rounded-full px-3 py-1', STATUS_CLASSES[status])}>
        {PROGRAM_STATUS_LABEL[status]}
      </li>
      <li className='rounded-full bg-surface px-3 py-1 text-navy'>
        {PROGRAM_AGES}
      </li>
    </ul>
  );
}
