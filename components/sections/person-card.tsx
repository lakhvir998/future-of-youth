import Image from 'next/image';

import type { Person } from '@/lib/content/leadership';

export function PersonCard({ person }: { person: Person }) {
  return (
    <article className='flex h-full flex-col gap-3 rounded-2xl bg-white p-6 shadow-md'>
      {person.photo && (
        <Image
          src={person.photo.src}
          alt={person.photo.alt}
          width={160}
          height={160}
          className='size-32 rounded-full object-cover'
        />
      )}
      <h3 className='text-xl font-bold text-navy'>{person.name}</h3>
      <p className='font-semibold text-brand'>{person.role}</p>
      <p className='text-ink'>{person.bio}</p>
    </article>
  );
}
