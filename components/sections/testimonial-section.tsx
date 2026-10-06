import Image from 'next/image';

export function TestimonialSection() {
  return (
    <section
      aria-label='Testimonial'
      className='flex w-full flex-col items-center gap-6 bg-white px-4 py-10 shadow-inner md:py-16'
    >
      <figure className='flex flex-col items-center gap-6'>
        <Image
          src='/student.jpg'
          alt=''
          width={96}
          height={96}
          className='size-24 rounded-full object-cover shadow-lg'
        />
        <blockquote className='max-w-2xl px-1 text-center text-base text-ink italic sm:px-4 sm:text-lg'>
          “You build lifelong friendships at Future of the Youth. The classes
          seem really intense at first, but the teachers ease you into it.
          Everyone is happy and friendly, and we always do fun activities and
          challenges.”
        </blockquote>
        <figcaption className='font-semibold text-brand'>
          Rachel, Future of the Youth Student
        </figcaption>
      </figure>
    </section>
  );
}
