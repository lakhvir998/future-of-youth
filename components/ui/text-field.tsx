import { useId, type ComponentProps } from 'react';

import { cn } from '@/lib/cn';

import { FieldError } from './field-error';

export const inputClasses =
  // gray-500 border = 4.8:1 on white (WCAG 1.4.11 needs 3:1). `outline-hidden`
  // still shows an outline in Windows forced-colors mode, unlike `outline-none`.
  'w-full min-w-0 rounded-lg border border-gray-500 bg-white px-4 py-3 text-ink placeholder-gray-600 focus:ring-2 focus:ring-brand focus:outline-hidden aria-invalid:border-red-700';

type TextFieldProps = Omit<ComponentProps<'input'>, 'id'> & {
  label: string;
  error?: string;
};

export function TextField({
  label,
  error,
  className,
  required,
  ...props
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex-1 text-left', className)}>
      <label htmlFor={id} className='mb-1 block font-semibold text-navy'>
        {label}
        {required && <span aria-hidden='true'> *</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClasses}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
