import { Section } from '@/components/ui/section';
import { BOARD, type Person } from '@/lib/content/leadership';

import { PersonCard } from './person-card';

/** Board of directors. Hidden until the client provides it. */
export function LeadershipSection({
  board = BOARD,
}: {
  board?: readonly Person[];
}) {
  if (board.length === 0) return null;

  return (
    <Section id='leadership' title='Leadership & Board of Directors'>
      <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {board.map((person) => (
          <li key={person.name}>
            <PersonCard person={person} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
