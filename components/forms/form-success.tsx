import { useEffect, useRef, type ReactNode } from 'react';

type FormSuccessProps = {
  title?: string;
  children: ReactNode;
};

export function FormSuccess({
  title = 'Thank you!',
  children,
}: FormSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The form (and the focused Submit button) just unmounted; move focus here
  // so keyboard and screen reader users land on the confirmation (WCAG 2.4.3).
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      role='status'
      className='flex flex-col items-center justify-center gap-6 py-8'
    >
      <svg
        aria-hidden='true'
        className='size-16 text-green-700'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
      </svg>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className='text-2xl font-bold text-green-700 focus:outline-hidden'
      >
        {title}
      </h3>
      <p className='max-w-md text-center text-lg text-gray-700'>{children}</p>
    </div>
  );
}
