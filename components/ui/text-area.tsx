import { useId, type ComponentProps } from 'react';

import { cn } from '@/lib/cn';

import { FieldError } from './field-error';
import { inputClasses } from './text-field';

type TextAreaProps = Omit<ComponentProps<'textarea'>, 'id'> & {
  label: string;
  error?: string;
  /** Persistent helper text, announced with the field. */
  hint?: string;
};

export function TextArea({
  label,
  error,
  hint,
  className,
  required,
  rows = 6,
  ...props
}: TextAreaProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('text-left', className)}>
      <label htmlFor={id} className='mb-1 block font-semibold text-navy'>
        {label}
        {required && <span aria-hidden='true'> *</span>}
      </label>
      {hint && (
        <p id={hintId} className='mb-1 text-sm text-gray-600'>
          {hint}
        </p>
      )}
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(inputClasses, 'resize-y')}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
